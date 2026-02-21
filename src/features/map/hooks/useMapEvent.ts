import { createMap, addImages } from "@/features/map/utils/map";
import maplibregl from "maplibre-gl";
import React, { useEffect, useRef, useState } from "react";
import { smoothMove, isMarker } from "@/features/map/utils/marker";

const useMapEvent = (
  mapContainerRef: React.RefObject<HTMLDivElement | null>,
  mapId: string | undefined,
  createMarker: (
    map: maplibregl.Map | null,
    id: number,
    latlng: maplibregl.LngLatLike,
    title: string,
  ) => maplibregl.Marker | undefined,
  cleanupDestinationMarkers: () => void,
) => {
  const timerId = useRef<number | undefined>(undefined);
  const timer = useRef<number>(0);
  const [mapState, setMapState] = useState<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || !mapId) return;
    const mapInstance = createMap(mapId, mapContainerRef.current);

    let currentPos: maplibregl.LngLat | null = null;
    let animationId: number | null = null;

    const userMarker = new maplibregl.Marker({ color: "red", opacity: "0" });

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

      const createDestMarker = (
        event: maplibregl.MapTouchEvent | maplibregl.MapMouseEvent,
      ) => {
        if (timer.current >= 1 && !isMarker(event)) {
          const addedMarker = createMarker(mapInstance, 0, event.lngLat, "");
          setTimeout(() => addedMarker?.togglePopup(), 0);
        }
        resetTimer();
      };

      let isTouch = false;
      mapInstance.on("touchstart", () => {
        isTouch = true;
        if (timerId.current) {
          resetTimer();
          return;
        }
        timerId.current = setInterval(() => (timer.current += 1), 300);
      });

      mapInstance.on("touchend", (event) => {
        createDestMarker(event);
        // if (timer.current >= 1 && !isMarker(event)) {
        //   const addedMarker = createMarker(mapInstance, 0, event.lngLat, "");
        //   setTimeout(() => addedMarker?.togglePopup(), 0);
        // }
        // resetTimer();
      });

      mapInstance.on("touchmove", () => resetTimer());
      mapInstance.on("touchcancel", () => resetTimer());

      mapInstance.on("mousedown", () => {
        if (isTouch) return;
        if (timerId.current) {
          resetTimer();
          return;
        }
        timerId.current = setInterval(() => (timer.current += 1), 300);
      });

      mapInstance.on("mouseup", (event) => {
        if (isTouch) return;

        createDestMarker(event);
        // if (timer.current >= 1 && !isMarker(event)) {
        //   const addedMarker = createMarker(mapInstance, 0, event.lngLat, "");
        //   setTimeout(() => addedMarker?.togglePopup(), 0);
        // }
        // resetTimer();
      });

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
      cleanupDestinationMarkers();
    };
  }, []);

  return { mapState };
};

export default useMapEvent;
