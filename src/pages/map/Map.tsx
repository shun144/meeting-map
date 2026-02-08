import useMap from "@/hooks/map/useMap";
import { useEffect, useState, type FC } from "react";
import type React from "react";
// import { openDatabase } from "./db";

type Props = React.ComponentProps<"div">;

const Map: FC<Props> = ({ className }) => {
  const { mapContainer } = useMap();

  // const [orientation, setOrientation] = useState({
  //   alpha: 0,
  //   beta: 0,
  //   gamma: 0,
  // });

  // // 使用許可を確認
  // const handlePermissionBtnClick = async () => {
  //   const DOE = DeviceOrientationEvent as any;
  //   DOE.requestPermission().then(async (val: string) => {
  //     if (val === "granted") {
  //       console.log("許可されました");
  //     } else {
  //       console.log("許可されませんでした");
  //     }
  //   });
  // };

  // useEffect(() => {
  //   const handleOrientation = (event: DeviceOrientationEvent) => {
  //     setOrientation({
  //       alpha: event.alpha ?? 0,
  //       beta: event.beta ?? 0,
  //       gamma: event.gamma ?? 0,
  //     });
  //   };
  //   window.addEventListener("deviceorientation", handleOrientation, true);
  //   return () => {
  //     window.removeEventListener("deviceorientation", handleOrientation);
  //   };
  // }, []);

  return (
    <div className={className}>
      <div ref={mapContainer} className="h-full w-full" />;
    </div>

    // <>
    //   <h1
    //     style={{
    //       transform: `translateX(${(orientation.gamma * 360) / 100}px)
    //                    translateY(${((orientation.beta - 30) * 360) / 100}px)`,
    //     }}
    //   >
    //     Try Device Orientation
    //   </h1>

    //   <button type="button" onClick={handlePermissionBtnClick}>
    //     方向の取得を許可する
    //   </button>
    // </>
  );
};

export default Map;
