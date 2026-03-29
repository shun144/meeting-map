import { type DestinationRepository } from "@/features/map/domains/DestinationRepository";
import useMapEvent from "@/features/map/hooks/useMapEvent";
import SupabaseDestinationRepository from "@/features/map/infrastructure/SupabaseDestinationRepository";
import { useMapStore } from "@/store/useMapStore";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import { DestinationMarkerService } from "../application/DestinationMarkerService";
import MapLoading from "./MapLoading";

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
  const { isMapReady } = useMapEvent(mapContainerRef, mapId, repo);

  return (
    <div className="relative h-full w-full">
      <div ref={mapContainerRef} className="h-full w-full" />
      <div
        className={`absolute inset-0 flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 transition-opacity duration-300 ${
          isMapReady ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <MapLoading />
      </div>
    </div>
  );
};

export default Map;
