import useMapEvent from "@/features/map/hooks/useMapEvent";
import { type DestinationRepository } from "@/features/map/domains/DestinationRepository";
import SupabaseDestinationRepository from "@/features/map/infrastructure/SupabaseDestinationRepository";
import { useEffect, useMemo, useRef } from "react";
import { useParams } from "react-router";
import useDestinationMarkerManager from "../hooks/useDestinationMarkerManager";
import { toast } from "react-toastify";

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

  const { markers, createMarker, cleanup } = useDestinationMarkerManager(repo);
  const { mapState } = useMapEvent(
    mapContainerRef,
    mapId,
    createMarker,
    cleanup,
  );

  useEffect(() => {
    console.log(markers.length);
    console.log(markers.map((x) => x.id).join(" "));
  }, [markers]);

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
  }, [mapState, repo, createMarker]);

  return <div ref={mapContainerRef} className="h-full w-full" />;
};

export default Map;
