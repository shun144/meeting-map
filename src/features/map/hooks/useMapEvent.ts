import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import type { DestinationRepository } from "../domains/DestinationRepository";
import { MaplibreAdapter } from "../infrastructure/maplibre/MaplibreAdapter";
import { DestinationMarkerService } from "../application/DestinationMarkerService";
import { useMapStore } from "@/store/useMapStore";
import type { LngLat } from "../domains/valueObjects/LngLat";
import { Destination } from "../domains/Destination";

const useMapEvent = (
  mapContainerRef: React.RefObject<HTMLDivElement | null>,
  mapId: string | undefined,
  repo: DestinationRepository,
) => {
  const [isMapReady, setIsMapReady] = useState(false);
  const navigate = useNavigate();
  const { createDestinationMarker } = new DestinationMarkerService(repo);
  const { addMarkers, cleanupMarkers } = useMapStore.getState();

  useEffect(() => {
    if (!mapContainerRef.current || !mapId) return;

    const onLongPress = (lngLat: LngLat) => {
      const d = new Destination(Date.now(), lngLat, "");
      const dm = createDestinationMarker(d, "NEW");
      dm.element.addTo(adapter.map);
      setTimeout(() => dm.element.togglePopup(), 0);
    };

    const onLoad = async () => {
      try {
        const allDestinationList = await repo.findAll();
        allDestinationList.forEach((d) => {
          const dm = createDestinationMarker(d, "SAVED");
          dm.element.addTo(adapter.map);
          addMarkers(dm);
        });
      } catch (error) {
        console.error(error);
        throw error;
      }
    };

    const adapter = MaplibreAdapter.create(
      mapId,
      mapContainerRef.current,
      onLongPress,
      onLoad,
    );

    adapter.onError((type) => {
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

    adapter.onReady(() => setIsMapReady(true));

    return () => {
      adapter.destroy(() => cleanupMarkers());
    };
  }, []);

  return { isMapReady };
};

export default useMapEvent;
