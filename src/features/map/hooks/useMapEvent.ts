import { useMapStore } from "@/store/useMapStore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { MapAdapterFactory } from "@/features/map/application/MapAdapterFactory";
import { type IMapAdapter } from "@/features/map/application/IMapAdapter";

const useMapEvent = (
  mapContainerRef: React.RefObject<HTMLDivElement | null>,
  mapId: string | undefined,
) => {
  const [isMapReady, setIsMapReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container || !mapId) return;

    let mapAdapter: IMapAdapter | null = null;
    let cancelled = false;

    (async () => {
      mapAdapter = await MapAdapterFactory.create(mapId, container);
      if (cancelled) {
        mapAdapter.destroy();
        return;
      }

      mapAdapter.onError((type) => {
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
      mapAdapter.onReady(() => setIsMapReady(true));
    })();

    return () => {
      cancelled = true;
      mapAdapter?.destroy();
      useMapStore.getState().cleanupMarkers();
    };
  }, [mapId]);

  return { isMapReady };
};

export default useMapEvent;
