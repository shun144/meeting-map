import useMapEvent from "@/features/map/hooks/useMapEvent";
import { DestinationRepository } from "@/repositories/DestinationRepository";
import { useEffect, useMemo, useRef } from "react";
import { useParams } from "react-router";
import useDestinationMarkerManager from "../hooks/useDestinationMarkerManager";
import { toast } from "react-toastify";

const MeetMap = () => {
  const { mapId } = useParams();
  const repo = useMemo(() => new DestinationRepository(mapId), [mapId]);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const { createMarker, cleanup } = useDestinationMarkerManager(repo);
  const { mapState } = useMapEvent(
    mapContainerRef,
    mapId,
    createMarker,
    cleanup,
  );

  useEffect(() => {
    if (!mapState) return;

    const load = async () => {
      try {
        const res = await repo.findAll();
        res.forEach((x) => createMarker(mapState, x.id, x.latlng, x.title));
      } catch (error) {
        console.error(error);
        toast.error("目的地の取得に失敗しました");
      }
    };
    load();
  }, [mapState]);

  return <div ref={mapContainerRef} className="h-full w-full" />;
};

export default MeetMap;
