import { useMapStore } from "@/store/useMapStore";
import maplibregl from "maplibre-gl";
import { PMTiles, Protocol } from "pmtiles";
import { useEffect, useRef } from "react";
import { mapStyle } from "./mapStyle";

const useMap = () => {
  const { setMap, setIsLoaded } = useMapStore();
  const mapContainer = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    const PMTILES_URL =
      "https://nwmuhxuprqnikmbcwteo.supabase.co/storage/v1/object/public/public-maps/disneyland.pmtiles";

    // MapLibre GLでPMTiles形式のタイルを読み込めるようにするための初期設定
    const protocol = new Protocol();
    maplibregl.addProtocol("pmtiles", protocol.tile);
    const pmtiles = new PMTiles(PMTILES_URL);
    protocol.add(pmtiles);

    const map = new maplibregl.Map({
      container: mapContainer.current,
      center: [139.8821, 35.6328],
      zoom: 16,
      minZoom: 15, // 最大縮小（どのぐらいまでズームアウトするか（数字が小さい程縮小）
      maxZoom: 20, // 最大拡大（どのぐらいまでズームインするか（数字が大きい程拡大）

      // style: mapStyle,

      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution: "© OpenStreetMap",
          },
        },
        layers: [
          {
            id: "osm-base",
            type: "raster",
            source: "osm",
            paint: {
              "raster-opacity": 0.9,
            },
          },
        ],
      },
    });

    map.on("load", () => {
      setIsLoaded(true);

      map.addControl(new maplibregl.NavigationControl());

      const geolocateControl = new maplibregl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true, // アプリケーションが可能な限り最良の結果を得たいことを示すブール値です。true の場合、デバイスがより正確な位置情報を提供できる場合は、その情報を提供します。ただし、これにより応答時間が遅くなったり、消費電力が増加したりする可能性があります（例えば、モバイルデバイスに GPS チップが搭載されている場合など）。一方、false の場合、デバイスは応答速度を速めたり、消費電力を抑えたりすることでリソースを節約できます。デフォルト: false
        },
        trackUserLocation: true,
        showAccuracyCircle: false,
        showUserLocation: true,
        fitBoundsOptions: {
          maxZoom: 20,
          linear: true,
          duration: 1000,
        },
      });

      map.addControl(geolocateControl);

      // // 位置情報が取得されたとき
      // geolocateControl.on("geolocate", (e: GeolocationPosition) => {
      //   console.log("位置情報が取得された");
      //   // console.log("現在位置:", e.coords);
      //   // console.log("緯度:", e.coords.latitude);
      //   // console.log("経度:", e.coords.longitude);
      //   // console.log("精度:", e.coords.accuracy, "メートル");
      //   // console.log("向き:", e.coords.heading); // デバイスの向き（度数法、北が0）
      //   // console.log("速度:", e.coords.speed); // m/s
      //   // console.log("高度:", e.coords.altitude);

      //   // alert(
      //   //   `【現在位置情報】\n\n` +
      //   //     `緯度: ${e.coords.latitude}\n` +
      //   //     `経度: ${e.coords.longitude}\n` +
      //   //     `精度: ${e.coords.accuracy} メートル\n` +
      //   //     `向き: ${e.coords.heading ?? "なし"}\n` +
      //   //     `速度: ${e.coords.speed ?? "なし"} m/s\n` +
      //   //     `高度: ${e.coords.altitude ?? "なし"}`,
      //   // );
      //   // console.log(e.coords.longitude, e.coords.latitude, e.coords.heading);
      //   // // ユーザーの位置にマーカーを追加
      //   // addUserMarker(e.coords.longitude, e.coords.latitude, e.coords.heading);
      // });

      // // トラッキングが開始されたとき
      // geolocateControl.on("trackuserlocationstart", () => {
      //   console.log("ユーザー位置のトラッキング開始");
      // });

      // // トラッキングが終了したとき
      // geolocateControl.on("trackuserlocationend", () => {
      //   console.log("ユーザー位置のトラッキング終了");
      // });

      // geolocateControl.on("userlocationlostfocus", function () {
      //   console.log("An userlocationlostfocus event has occurred.");
      // });

      // geolocateControl.on("userlocationfocus", function () {
      //   console.log("An userlocationfocus event has occurred.");
      // });

      // geolocateControl.on("geolocate", () => {
      //   console.log("A geolocate event has occurred.");
      // });

      // geolocateControl.on("outofmaxbounds", () => {
      //   console.log("An outofmaxbounds event has occurred.");
      // });

      // // エラーが発生したとき
      // geolocateControl.on("error", (e: GeolocationPositionError) => {
      //   console.error("位置情報エラー:", e.message);
      // });
    });

    setMap(map);

    return () => {
      map.remove();
    };
  }, []);

  return { mapContainer };
};

export default useMap;
