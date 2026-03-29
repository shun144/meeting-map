import type {
  IMapAdapter,
  MapErrorType,
} from "@/features/map/application/IMapAdapter";
import { LngLat } from "@/features/map/domains/valueObjects/LngLat";
import { addImages, createMap } from "@/features/map/utils/map";
import maplibregl from "maplibre-gl";
import { isMarker, smoothMove } from "../../utils/marker";
import { createUserMarkerElement } from "../../utils/userMarker";

export class MaplibreAdapter implements IMapAdapter {
  private _map: maplibregl.Map | null = null;
  private _geolocateControl: maplibregl.GeolocateControl | null = null;
  private _timerId: number | undefined = undefined;
  private _timer: number = 0;
  private _userMarker: maplibregl.Marker | null = null;
  private errorCallback: ((type: MapErrorType) => void) | null = null;
  private _animationId: number | null = null;
  private longPressCallback: ((lngLat: LngLat) => Promise<void> | void) | null =
    null;

  private constructor() {}

  static create(
    id: string,
    container: HTMLDivElement,
    onLongPress: (lngLat: LngLat) => Promise<void> | void,
    onLoad?: () => Promise<void> | void,
  ): MaplibreAdapter {
    const adapter = new MaplibreAdapter();
    adapter.init(id, container);
    adapter.onLongPress(onLongPress); // onLoad より前に呼ぶこと
    adapter.onLoad(onLoad);
    return adapter;
  }

  init(id: string, container: HTMLDivElement) {
    this._map = createMap(id, container);
    this._map?.on("styledata", () => addImages(this._map!));
    this._userMarker = this.createUserMarker();
  }

  onLongPress(callback: (lngLat: LngLat) => Promise<void> | void) {
    this.longPressCallback = callback;
  }

  onLoad(callback?: () => Promise<void> | void): void {
    if (this._map?.loaded()) {
      this.initLongPressEvent();
      this.initGeolocateControl();
      this.initCursorBehavior();
      if (callback) callback();
      return;
    }

    this._map?.on("load", () => {
      this.initLongPressEvent();
      this.initGeolocateControl();
      this.initCursorBehavior();
      if (callback) callback();
    });
  }

  onError(callback: (type: MapErrorType) => Promise<void> | void) {
    this.errorCallback = callback;
    this._map?.on("error", (event) => {
      if (event.error.message !== "Failed to fetch") return;
      navigator.onLine
        ? callback("fetch-failed-online")
        : callback("fetch-failed-offline");
    });
  }

  onReady(callback: () => Promise<void> | void) {
    const handler = () => {
      callback();
      this._map?.off("idle", handler);
    };
    // idleイベントは地図移動完了時も発火する
    this._map?.on("idle", handler);
  }

  destroy(callback?: () => Promise<void> | void) {
    if (this._timerId) {
      clearInterval(this._timerId);
      this._timerId = undefined;
    }
    this._timer = 0;

    if (this._animationId) {
      cancelAnimationFrame(this._animationId);
    }

    if (this._userMarker) {
      this._userMarker.remove();
    }

    if (this._map) {
      this._map.remove();
    }

    if (callback) callback();
  }

  private initCursorBehavior() {
    this._map?.on("movestart", (event) => {
      if (!(event.originalEvent instanceof WheelEvent)) {
        this._map!.getCanvas().style.cursor = "grabbing";
      }
    });

    this._map?.on("moveend", () => {
      this._map!.getCanvas().style.cursor = "pointer";
    });
  }

  private initLongPressEvent() {
    const resetTimer = () => {
      clearInterval(this._timerId);
      this._timerId = undefined;
      this._timer = 0;
    };

    const restartTimer = () => {
      if (this._timerId) {
        resetTimer();
        return;
      }
      this._timerId = setInterval(() => (this._timer += 1), 300);
    };

    const insertDestinationMarker = (
      event: maplibregl.MapTouchEvent | maplibregl.MapMouseEvent,
    ) => {
      if (this._timer >= 1 && !isMarker(event)) {
        const lngLat = new LngLat(event.lngLat.lng, event.lngLat.lat);
        if (this.longPressCallback) this.longPressCallback(lngLat);
      }
      resetTimer();
    };

    let isTouch = false;

    // マーカーの作成（タッチ操作/マウス操作）
    this._map?.on("touchend", insertDestinationMarker);
    this._map?.on("mouseup", (event) => {
      if (isTouch) return;
      insertDestinationMarker(event);
    });

    // タイマーのリスタート（タッチ操作/マウス操作）
    this._map?.on("touchstart", () => {
      isTouch = true;
      restartTimer();
    });
    this._map?.on("mousedown", () => {
      if (isTouch) return;
      restartTimer();
    });
    // タイマーリセット（タッチ操作/マウス操作）
    this._map?.on("touchmove", () => resetTimer());
    this._map?.on("touchcancel", () => resetTimer());
    this._map?.on("movestart", () => {
      if (isTouch) return;
      resetTimer();
    });
  }

  private createUserMarker() {
    return new maplibregl.Marker({
      element: createUserMarkerElement(),
      rotationAlignment: "map", // 地図の向き先を変えるとユーザーアイコンの向き先も変える
      pitchAlignment: "map",
    });
  }

  private initGeolocateControl() {
    this._geolocateControl = new maplibregl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
      showAccuracyCircle: false,
      showUserLocation: false,

      fitBoundsOptions: {
        zoom: this._map?.getZoom(),
        linear: true,
        duration: 0,
      },
    });
    this._map?.addControl(this._geolocateControl);

    let currentPos: maplibregl.LngLat | null = null;

    this._geolocateControl?.on("geolocate", (event) => {
      const newPos = new maplibregl.LngLat(
        event.coords.longitude,
        event.coords.latitude,
      );

      if (!currentPos) {
        currentPos = newPos;
        this._userMarker?.setLngLat(newPos).addTo(this._map!);
        this._map?.jumpTo({ center: newPos, zoom: 18 });
        return;
      }

      this._animationId = smoothMove(
        this._animationId,
        currentPos,
        newPos,
        600,
        (lnglat) => this._userMarker?.setLngLat(lnglat),
      );
      currentPos = newPos;
    });

    this._geolocateControl?.on("trackuserlocationstart", async () => {
      await this.startCompass();
      this._userMarker?.setOpacity("1");
    });

    this._geolocateControl?.on("outofmaxbounds", () => {
      this.errorCallback?.("out-of-bounds");
    });

    // バックグラウンド状態に切り替わった時に発火;
    // アクティブロック状態でユーザがカメラを移動させた時;
    // バックグラウンド状態は位置情報の更新はするがカメラは移動しない;
    this._geolocateControl?.on("trackuserlocationend", (event) => {
      if (event.target._watchState === "OFF") {
        this._userMarker?.setOpacity("0");
      }
    });
  }

  private async startCompass() {
    if (
      typeof (DeviceOrientationEvent as any).requestPermission === "function"
    ) {
      const permission = await (
        DeviceOrientationEvent as any
      ).requestPermission();

      if (permission !== "granted") return;
    }

    window.addEventListener("deviceorientation", (event) => {
      const heading = (event as any).webkitCompassHeading ?? event.alpha ?? 0;
      this._userMarker?.setRotation(heading);
    });
  }

  // TODO: DestinationMarker リファクタ完了後に削除
  get map() {
    return this._map!;
  }
}
