import { images } from "@/assets/icon";
import { mapStyles } from "@/config/mapStyle";
import { DestinationMarkerService } from "@/features/map/application/DestinationMarkerService";
import type { IDestinationMarker } from "@/features/map/application/IDestinationMarker";
import type { IMap, MapErrorType } from "@/features/map/application/IMap";
import { Destination } from "@/features/map/domains/entities/Destination";
import { LngLat } from "@/features/map/domains/valueObjects/LngLat";
import { isMarker, smoothMove } from "@/features/map/utils/marker";
import { createUserMarkerElement } from "@/features/map/utils/userMarker";
import maplibregl from "maplibre-gl";
import { PMTiles, Protocol } from "pmtiles";

export class MaplibreMap implements IMap {
  private _map: maplibregl.Map | null = null;
  private _geolocateControl: maplibregl.GeolocateControl | null = null;
  private _timerId: number | undefined = undefined;
  private _timer: number = 0;
  private _userMarker: maplibregl.Marker | null = null;
  private errorCallback: ((type: MapErrorType) => void) | null = null;
  private _animationId: number | null = null;

  constructor(
    private _id: string,
    private _destinationMarkerService: DestinationMarkerService,
    private _initialDestinationMarkers: IDestinationMarker[],
  ) {}

  init(container: HTMLDivElement) {
    this._map = this.createMap(this._id, container);
    this._map.getCanvas().style.cursor = "pointer";
    this._map.on("styledata", () => this.addImages());
    this._userMarker = this.createUserMarker();
    this.onLoad();
  }

  onLoad(callback?: () => Promise<void> | void): void {
    const run = () => {
      this.initAll();
      callback?.();
    };
    this._map?.loaded() ? run() : this._map?.on("load", run);
  }

  private initAll() {
    this.initLongPressEvent();
    this.initGeolocateControl();
    this.initCursorBehavior();
    this.initMarker();
  }

  private initMarker() {
    this.addMarkers(this._initialDestinationMarkers);
  }

  onError(callback: (type: MapErrorType) => Promise<void> | void) {
    this.errorCallback = callback;
    this._map?.on("error", (event) => {
      if (event.error.message !== "Failed to fetch") return;
      navigator.onLine
        ? this.errorCallback?.("fetch-failed-online")
        : this.errorCallback?.("fetch-failed-offline");
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

  addMarker(marker: IDestinationMarker) {
    marker.addToMap(this._map!);
    marker.popup();
  }

  addMarkers(markers: IDestinationMarker[]) {
    markers.forEach((marker) => marker.addToMap(this._map!));
  }

  destroy(callback?: () => Promise<void> | void) {
    clearInterval(this._timerId);
    this._timerId = undefined;
    if (this._animationId) {
      cancelAnimationFrame(this._animationId);
    }
    this._userMarker?.remove();
    this._map?.remove();
    callback?.();
  }

  private createMap(id: string, container: HTMLDivElement) {
    const { src, style, center, zoom, maxZoom, minZoom, sw, ne } =
      mapStyles[id];
    const protocol = new Protocol();
    maplibregl.addProtocol("pmtiles", protocol.tile);
    const pmtiles = new PMTiles(src);
    const maxBounds =
      sw && ne ? new maplibregl.LngLatBounds(sw, ne) : undefined;
    protocol.add(pmtiles);
    return new maplibregl.Map({
      container,
      center,
      zoom,
      maxZoom,
      minZoom,
      maxBounds,
      style,
      doubleClickZoom: false,
      hash: true,
    });
  }

  private addImages() {
    if (!this._map) return;
    for (const [name, src] of Object.entries(images)) {
      if (this._map.hasImage(name)) continue;
      const img = new Image(55, 64);

      img.onload = () => {
        // 非同期のため、ロード完了までに他で追加済みの可能性がある
        if (this._map?.hasImage(name)) return;
        this._map?.addImage(name, img);
      };
      img.src = src;
    }
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
        const d = new Destination(Date.now(), lngLat, "");
        const dm = this._destinationMarkerService.createNewDestinationMarker(d);
        this.addMarker(dm);
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
}
