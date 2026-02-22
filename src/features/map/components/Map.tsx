import useMapEvent from "@/features/map/hooks/useMapEvent";
import { type DestinationRepository } from "@/features/map/domains/DestinationRepository";
import SupabaseDestinationRepository from "@/features/map/infrastructure/SupabaseDestinationRepository";
import { useEffect, useMemo, useRef } from "react";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import { useMapStore } from "@/store/useMapStore";
import { Destination } from "../domains/Destination";
import DestinationMarker from "../domains/DestinationMarker";
import useDestinationMarkerManager from "../hooks/useDestinationMarkerManager";

const Map = () => {
  const { mapId } = useParams();
  const repo = useMemo(
    () => new SupabaseDestinationRepository(mapId!),
    [mapId],
  );
  return <BaseMap mapId={mapId} repo={repo} />;
};

interface Props {
  mapId: string | undefined;
  repo: DestinationRepository;
}

const BaseMap = ({ mapId, repo }: Props) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const { mapState } = useMapEvent(mapContainerRef, mapId, repo);
  const { addMarkers } = useMapStore.getState();
  const { createDestinationMarker } = useDestinationMarkerManager(repo);

  useEffect(() => {
    if (!mapState) return;
    const load = async () => {
      try {
        const res = await repo.findAll();
        res.forEach((destination) => {
          const dm = createDestinationMarker(destination, "SAVED");
          dm.element.addTo(mapState);
          addMarkers(dm);
        });
      } catch (error) {
        console.error(error);
        toast.error("目的地の取得に失敗しました");
      }
    };
    load();
  }, [mapState, repo]);

  return <div ref={mapContainerRef} className="h-full w-full" />;
};

export default Map;
