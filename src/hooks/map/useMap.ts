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

    const protocol = new Protocol();
    maplibregl.addProtocol("pmtiles", protocol.tile);
    const p = new PMTiles(PMTILES_URL);
    protocol.add(p);

    // // メタデータを確認
    // p.getMetadata().then((metadata) => {
    //   const data = metadata.tilestats.layers[0].attributes;
    //   console.log(data);
    // });

    const map = new maplibregl.Map({
      container: mapContainer.current,
      center: [139.8821, 35.6328],
      zoom: 16,
      minZoom: 15, // 最大縮小（どのぐらいまでズームアウトするか（数字が小さい程縮小）
      maxZoom: 19, // 最大拡大（どのぐらいまでズームインするか（数字が大きい程拡大）

      style: mapStyle,

      // style: {
      //   version: 8,
      //   sources: {
      //     osm: {
      //       type: "raster",
      //       tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      //       tileSize: 256,
      //       attribution: "© OpenStreetMap",
      //     },
      //   },
      //   layers: [
      //     {
      //       id: "osm-base",
      //       type: "raster",
      //       source: "osm",
      //       paint: {
      //         "raster-opacity": 0.9,
      //       },
      //     },
      //   ],
      // },
    });

    map.on("load", () => {
      setIsLoaded(true);

      map.addControl(new maplibregl.NavigationControl());

      // // 「アリスのティーパーティー」を検索
      // const features = map.querySourceFeatures("tdl", {
      //   sourceLayer: "disneyland",
      // });

      // // 名前に「アリス」を含むものを探す
      // const alice = features.filter(
      //   (f) => f.properties.name && f.properties.name.includes("アリス"),
      // );

      // console.log("アリスのティーパーティー:", alice);
      // console.log("プロパティ:", alice[0]?.properties);
    });

    setMap(map);

    return () => {
      map.remove();
    };
  }, []);

  return { mapContainer };
};

export default useMap;

// import { useEffect, useRef } from "react";
// import maplibregl from "maplibre-gl";
// import { OfflineManagerControl, OfflineMapManager } from "map-gl-offline";
// // import "map-gl-offline/dist/style.css";
// import { useMapStore } from "@/store/useMapStore";
// import { Protocol, PMTiles } from "pmtiles";

// const useMap = () => {
//   const { setMap, setIsLoaded } = useMapStore();
//   const mapContainer = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     if (!mapContainer.current) return;

//     // const map = new maplibregl.Map({
//     //   container: mapContainer.current,
//     //   style: "https://tile.openstreetmap.jp/styles/osm-bright-ja/style.json",

//     //   // style: {
//     //   //   version: 8,
//     //   //   sources: {
//     //   //     "base-map": {
//     //   //       type: "raster",
//     //   //       tiles: [
//     //   //         "https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg",
//     //   //       ],
//     //   //       tileSize: 256,
//     //   //       attribution:
//     //   //         'Map tiles by <a target="_blank" href="https://stamen.com">Stamen Design</a>; Hosting by <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a>. Data &copy; <a href="https://www.openstreetmap.org/about" target="_blank">OpenStreetMap</a> contributors',
//     //   //     },
//     //   //   },
//     //   //   layers: [
//     //   //     {
//     //   //       id: "base-tiles",
//     //   //       type: "raster",
//     //   //       source: "base-map",
//     //   //       minzoom: 11,
//     //   //       maxzoom: 20,
//     //   //     },
//     //   //   ],
//     //   // },
//     //   center: [139.8800898, 35.6328464],
//     //   zoom: 14,
//     //   minZoom: 11,
//     //   maxZoom: 22,
//     // });

//     const PMTILES_URL = "/disneyland.pmtiles";

//     const protocol = new Protocol();
//     maplibregl.addProtocol("pmtiles", protocol.tile);
//     const p = new PMTiles(PMTILES_URL);
//     protocol.add(p);

//     // // メタデータを確認
//     // p.getMetadata().then((metadata) => {
//     //   console.log("=== PMTiles Metadata ===");
//     //   console.log("Full metadata:", metadata);
//     //   console.log("Vector layers:", metadata.vector_layers);
//     //   console.log("Bounds:", metadata.bounds);
//     //   console.log("Center:", metadata.center);
//     //   console.log("Min/Max zoom:", metadata.minzoom, metadata.maxzoom);
//     // });

//     const map = new maplibregl.Map({
//       container: mapContainer.current,
//       center: [139.8821, 35.6328],
//       zoom: 16,
//       style: {
//         version: 8,
//         sources: {
//           osm: {
//             type: "raster",
//             tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
//             tileSize: 256,
//             attribution: "© OpenStreetMap",
//           },
//           tdl: {
//             type: "vector",
//             url: "pmtiles://" + PMTILES_URL,
//           },
//         },
//         layers: [
//           {
//             id: "osm-base",
//             type: "raster",
//             source: "osm",
//             paint: {
//               "raster-opacity": 0.5,
//             },
//           },
//           // 緑地・森
//           {
//             id: "landuse-green",
//             source: "tdl",
//             "source-layer": "disneyland",
//             type: "fill",
//             filter: ["in", "landuse", "forest", "grass"],
//             paint: {
//               "fill-color": "#90ee90",
//               "fill-opacity": 0.4,
//             },
//           },
//           // 水域
//           {
//             id: "water",
//             source: "tdl",
//             "source-layer": "disneyland",
//             type: "fill",
//             filter: ["==", "natural", "water"],
//             paint: {
//               "fill-color": "#4169e1",
//               "fill-opacity": 0.5,
//             },
//           },
//           // 建物
//           {
//             id: "buildings",
//             source: "tdl",
//             "source-layer": "disneyland",
//             type: "fill",
//             filter: ["has", "building"],
//             paint: {
//               "fill-color": "#d4a5a5",
//               "fill-opacity": 0.7,
//             },
//           },
//           {
//             id: "buildings-outline",
//             source: "tdl",
//             "source-layer": "disneyland",
//             type: "line",
//             filter: ["has", "building"],
//             paint: {
//               "line-color": "#8b4513",
//               "line-width": 1,
//             },
//           },
//           // アトラクション（強調表示）
//           {
//             id: "attractions",
//             source: "tdl",
//             "source-layer": "disneyland",
//             type: "fill",
//             filter: ["has", "attraction"],
//             paint: {
//               "fill-color": "#ff1493",
//               "fill-opacity": 0.6,
//             },
//           },
//           {
//             id: "attractions-outline",
//             source: "tdl",
//             "source-layer": "disneyland",
//             type: "line",
//             filter: ["has", "attraction"],
//             paint: {
//               "line-color": "#ff1493",
//               "line-width": 2,
//             },
//           },
//           // 道路
//           {
//             id: "roads",
//             source: "tdl",
//             "source-layer": "disneyland",
//             type: "line",
//             filter: ["has", "highway"],
//             paint: {
//               "line-color": "#ffd700",
//               "line-width": 2,
//             },
//           },
//           // ショップ
//           {
//             id: "shops",
//             source: "tdl",
//             "source-layer": "disneyland",
//             type: "circle",
//             filter: ["has", "shop"],
//             paint: {
//               "circle-radius": 6,
//               "circle-color": "#9370db",
//               "circle-stroke-color": "#fff",
//               "circle-stroke-width": 1,
//             },
//           },
//           // レストラン
//           {
//             id: "restaurants",
//             source: "tdl",
//             "source-layer": "disneyland",
//             type: "circle",
//             filter: ["in", "amenity", "restaurant", "cafe", "fast_food"],
//             paint: {
//               "circle-radius": 6,
//               "circle-color": "#ff6347",
//               "circle-stroke-color": "#fff",
//               "circle-stroke-width": 1,
//             },
//           },
//         ],
//       },
//     });

//     map.on("load", () => {
//       setIsLoaded(true);
//       // const offlineControl = new OfflineManagerControl();

//       // const offlineManager = new OfflineMapManager();
//       // map.addControl(offlineControl);

//       map.addControl(new maplibregl.NavigationControl());
//     });
//     setMap(map);

//     return () => {
//       map.remove();
//     };
//   }, []);

//   return { mapContainer };
// };

// export default useMap;
