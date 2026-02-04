import useMap from "@/hooks/map/useMap";
import { useEffect, type FC } from "react";
import type React from "react";
import { openDatabase } from "./db";

type Props = React.ComponentProps<"div">;

const Map: FC<Props> = ({ className }) => {
  // useEffect(() => {
  //   const initDb = async () => {
  //     try {
  //       await openDatabase();
  //     } catch (error) {
  //       console.error("DB作成失敗");
  //     }
  //   };

  //   initDb();
  // }, []);

  const { mapContainer } = useMap();
  return (
    <div className={className}>
      <div ref={mapContainer} className="h-full w-full" />;
    </div>
  );
};

export default Map;
