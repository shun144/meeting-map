import { useMapStore } from "@/store/useMapStore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { MapFactory } from "@/features/map/infrastructure/maplibre/MapFactory";
import { type IMap } from "@/features/map/application/IMap";
import type { MarkerStoreActions } from "../application/MarkerStoreActions";

const useMapEvent = (
  mapContainerRef: React.RefObject<HTMLDivElement | null>,
  mapId: string | undefined,
) => {
  const [isMapReady, setIsMapReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container || !mapId) return;

    let map: IMap | null = null;
    let cancelled = false;

    (async () => {
      const storeActions: MarkerStoreActions = {
        addMarker: (marker) => useMapStore.getState().addMarker(marker),
        updateMarker: (marker) => useMapStore.getState().updateMarker(marker),
        initializeMarkers: (markers) =>
          useMapStore.getState().initializeMarkers(markers),
        cleanupMarkers: () => useMapStore.getState().cleanupMarkers(),
      };

      map = await MapFactory.create(mapId, container, storeActions);
      if (cancelled) {
        map.destroy();
        return;
      }

      map.onError((type) => {
        switch (type) {
          case "fetch-failed-online":
            toast.error("地図データの読み込みに失敗しました", {
              toastId: "map-fetch-error",
            });
            break;
          case "fetch-failed-offline":
            navigate("/map-not-found");
            break;
          default:
            console.warn("未対応のエラータイプ:", type);
            break;
        }
      });
      map.onReady(() => setIsMapReady(true));
    })();

    return () => {
      cancelled = true;
      map?.destroy();
      useMapStore.getState().cleanupMarkers();
    };
  }, [mapId]);

  return { isMapReady };
};

export default useMapEvent;
