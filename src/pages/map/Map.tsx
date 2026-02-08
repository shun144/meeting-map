import useMap from "@/hooks/map/useMap";
import { useEffect, type FC } from "react";
import type React from "react";
// import { openDatabase } from "./db";

type Props = React.ComponentProps<"div">;

const Map: FC<Props> = ({ className }) => {
  const { mapContainer } = useMap();

  async function requestDeviceOrientationPermission() {
    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof (DeviceOrientationEvent as any).requestPermission === "function"
    ) {
      try {
        const permission = await (
          DeviceOrientationEvent as any
        ).requestPermission();
        if (permission === "granted") {
          console.log("DeviceOrientation許可されました");
          return true;
        } else {
          console.log("DeviceOrientation拒否されました");
          return false;
        }
      } catch (error) {
        console.error("DeviceOrientation許可エラー:", error);
        return false;
      }
    }
    // iOS 12以下または非iOS
    return true;
  }

  let currentHeading = 0;

  const onClick = async () => {
    const granted = await requestDeviceOrientationPermission();
    console.log(granted);

    if (granted) {
      window.addEventListener(
        "deviceorientationabsolute",
        (event) => {
          if (event.alpha !== null) {
            // alpha: 0-360度（北が0度、時計回り）
            currentHeading = 360 - event.alpha; // iOSでは逆向きなので反転
            alert(`現在の向き:${currentHeading}度`);
          }
        },
        true,
      );
    }
  };

  return (
    <div className={className}>
      <button onClick={onClick} className="bg-emerald-200">
        サンプル
      </button>
      <div ref={mapContainer} className="h-full w-full" />;
    </div>
  );
};

export default Map;
