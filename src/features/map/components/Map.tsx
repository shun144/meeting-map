import useMapEvent from "@/features/map/hooks/useMapEvent";
import { useRef } from "react";
import { useParams } from "react-router";
import MapLoading from "./MapLoading";

const Map = () => {
  const { mapId } = useParams();
  return <BaseMap mapId={mapId} />;
};

interface Props {
  mapId: string | undefined;
}

const BaseMap = ({ mapId }: Props) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const { isMapReady } = useMapEvent(mapContainerRef, mapId);

  return (
    <div className="relative h-full w-full pb-8 sm:pb-0">
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
