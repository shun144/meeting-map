import useMap from "@/hooks/map/useMap";
import type { FC } from "react";
import type React from "react";

type Props = React.ComponentProps<"div">;

const Map: FC<Props> = ({ className }) => {
  const { mapContainer } = useMap();
  return (
    <div className={className}>
      <div ref={mapContainer} className="h-full w-full" />;
    </div>
  );
};

export default Map;
