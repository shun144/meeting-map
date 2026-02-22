import { addImages, createMap } from "@/features/map/utils/map";
import { isMarker, smoothMove } from "@/features/map/utils/marker";
import { useMapStore } from "@/store/useMapStore";
import maplibregl from "maplibre-gl";
import React, { useEffect, useRef, useState } from "react";
import { Destination } from "../domains/Destination";
import type { DestinationRepository } from "../domains/DestinationRepository";
import useDestinationMarkerManager from "./useDestinationMarkerManager";
import { toast } from "react-toastify";
import { createUserMarkerElement } from "../utils/userMarker";

const useMapEvent = (
  mapContainerRef: React.RefObject<HTMLDivElement | null>,
  mapId: string | undefined,
  repo: DestinationRepository,
) => {
  const timerId = useRef<number | undefined>(undefined);
  const timer = useRef<number>(0);
  const [mapState, setMapState] = useState<maplibregl.Map | null>(null);

  const { createDestinationMarker } = useDestinationMarkerManager(repo);

  useEffect(() => {
    if (!mapContainerRef.current || !mapId) return;

    const { addMarkers, cleanupMarkers } = useMapStore.getState();
    const mapInstance = createMap(mapId, mapContainerRef.current);

    let currentPos: maplibregl.LngLat | null = null;
    let animationId: number | null = null;
    const userMarker = new maplibregl.Marker({
      element: createUserMarkerElement(),
    });

    mapInstance.on("load", () => {
      setMapState(mapInstance);

      mapInstance.addControl(new maplibregl.NavigationControl());

      const geolocateControl = new maplibregl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
        showAccuracyCircle: false,
        showUserLocation: false,

        fitBoundsOptions: {
          zoom: mapInstance.getZoom(),
          linear: true,
          duration: 0,
        },
      });
      mapInstance.addControl(geolocateControl);

      geolocateControl.on("geolocate", (event) => {
        const heading = event.coords.heading ?? 0;
        userMarker.setRotation(heading);

        const newPos = new maplibregl.LngLat(
          event.coords.longitude,
          event.coords.latitude,
        );

        if (!currentPos) {
          currentPos = newPos;
          userMarker.setLngLat(newPos).addTo(mapInstance);
          mapInstance.jumpTo({ center: newPos, zoom: 18 });
          return;
        }

        animationId = smoothMove(
          animationId,
          currentPos,
          newPos,
          600,
          (lnglat) => userMarker.setLngLat(lnglat),
        );
        currentPos = newPos;
      });

      geolocateControl.on("trackuserlocationstart", () => {
        userMarker.setOpacity("1");
      });

      geolocateControl.on("outofmaxbounds", () => {
        toast.error("現在地が地図の範囲外です");
      });

      // バックグラウンド状態に切り替わった時に発火;
      // アクティブロック状態でユーザがカメラを移動させた時;
      // バックグラウンド状態は位置情報の更新はするがカメラは移動しない;
      geolocateControl.on("trackuserlocationend", (event) => {
        if (event.target._watchState === "OFF") {
          userMarker.setOpacity("0");
        }
      });

      const resetTimer = () => {
        clearInterval(timerId.current);
        timerId.current = undefined;
        timer.current = 0;
      };

      const restartTimer = () => {
        if (timerId.current) {
          resetTimer();
          return;
        }
        timerId.current = setInterval(() => (timer.current += 1), 300);
      };

      const insertDestinationMarker = (
        event: maplibregl.MapTouchEvent | maplibregl.MapMouseEvent,
      ) => {
        if (timer.current >= 1 && !isMarker(event)) {
          const destination = new Destination(Date.now(), event.lngLat, "");
          const dm = createDestinationMarker(destination, "NEW");
          dm.element.addTo(mapInstance);
          addMarkers(dm);
          setTimeout(() => dm.element.togglePopup(), 0);
        }
        resetTimer();
      };

      let isTouch = false;

      // マーカーの作成（タッチ操作/マウス操作）
      mapInstance.on("touchend", insertDestinationMarker);
      mapInstance.on("mouseup", (event) => {
        if (isTouch) return;
        insertDestinationMarker(event);
      });

      // タイマーのリスタート（タッチ操作/マウス操作）
      mapInstance.on("touchstart", () => {
        isTouch = true;
        restartTimer();
      });
      mapInstance.on("mousedown", () => {
        if (isTouch) return;
        restartTimer();
      });

      // タイマーリセット（タッチ操作/マウス操作）
      mapInstance.on("touchmove", () => resetTimer());
      mapInstance.on("touchcancel", () => resetTimer());
      mapInstance.on("movestart", () => {
        if (isTouch) return;
        resetTimer();
      });
    });

    mapInstance.on("styledata", () => addImages(mapInstance));

    return () => {
      if (timerId.current) {
        clearInterval(timerId.current);
        timerId.current = undefined;
      }
      timer.current = 0;

      if (animationId) {
        cancelAnimationFrame(animationId);
      }

      if (userMarker) {
        userMarker.remove();
      }

      if (mapInstance) {
        mapInstance.remove();
      }

      setMapState(null);
      cleanupMarkers();
    };
  }, []);

  return { mapState };
};

export default useMapEvent;
