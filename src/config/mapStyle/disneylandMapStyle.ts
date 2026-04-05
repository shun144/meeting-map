import { type MapSrcStyle } from "./types";
import { osmAttribution } from "./constants";
import type { SymbolLayerSpecification } from "maplibre-gl";

const PMTILES_SRC =
  "https://nwmuhxuprqnikmbcwteo.supabase.co/storage/v1/object/public/public-maps/version1/disneyland.pmtiles";

// ===================================================
// 🎨 マップカラーテーマ — ここを変更するだけで全体に反映
// ===================================================
const theme = {
  /** 背景・地面ベース */
  background: "#f5f5f2",
  /** テーマパーク内地面 */
  ground: "#f0ede8",
  /** 水域 */
  water: "#b8d8ea",
  /** 道路・歩道・橋 */
  road: "#ffffff",
  /** 緑地・公園・庭園 */
  green: "#C2F0D4",
  /** 花壇 */
  flowerbed: "#b8dcb0",
  /** 建物塗り */
  building: "#E7E8EB",
  /** 建物アウトライン */
  buildingLine: "#c8cdd4",
  /** 鉄道（背景） */
  railBg: "#b0a090",
  /** 鉄道（前景） */
  railFg: "#e0d0b0",
  /** アトラクション名 */
  labelAttraction: "#BE5103",
  /** ショップ名 */
  labelShop: "#2B7FFF",
  /** レストラン・ファストフード名 */
  labelFood: "#E84335",
  /** カフェ名 */
  labelCafe: "#E84335",
  /** テキストハロー */
  halo: "rgba(255, 255, 255, 0.95)",
} as const;

// ===================================================
// 共通レイアウト
// ===================================================
const layerSource = {
  source: "tdl",
  "source-layer": "disneyland",
};

const textStyle = {
  "text-field": [
    "coalesce",
    ["get", "name:ja"],
    ["get", "name"],
    ["get", "name:en"],
  ],
  "text-font": ["Noto Sans Regular"],
  "text-size": ["interpolate", ["linear"], ["zoom"], 17, 12, 18, 11],
  "text-variable-anchor": ["top", "right", "left"],
  "text-radial-offset": 0.8,
  "text-max-width": 10,
  "text-padding": 4,

  // テキストは衝突したら消す
  "text-allow-overlap": false,
  "text-ignore-placement": false,
} satisfies Partial<SymbolLayerSpecification["layout"]>;

const iconStyle = {
  "icon-size": ["interpolate", ["linear"], ["zoom"], 16, 0.4],
  "icon-padding": 10,

  // アイコンは常に表示
  "icon-allow-overlap": true,
  "icon-ignore-placement": true,
} satisfies Partial<SymbolLayerSpecification["layout"]>;

export const disneylandMapStyle: MapSrcStyle = {
  src: PMTILES_SRC,
  center: [139.8786137, 35.6339284],
  zoom: 17,
  maxZoom: 19,
  minZoom: 15,
  sw: { lng: 139.8564, lat: 35.6122 },
  ne: { lng: 139.9052, lat: 35.6538 },
  style: {
    version: 8,
    glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
    sources: {
      tdl: {
        type: "vector",
        url: "pmtiles://" + PMTILES_SRC,
        attribution: osmAttribution,
        maxzoom: 14,
      },
    },
    layers: [
      {
        id: "background",
        type: "background",
        paint: { "background-color": theme.background },
      },
      {
        id: "ground",
        ...layerSource,
        type: "fill",
        filter: [
          "any",
          ["==", "resort", "theme_park"],
          ["==", "tourism", "theme_park"],
        ],
        paint: { "fill-color": theme.ground, "fill-opacity": 1 },
      },
      {
        id: "water",
        ...layerSource,
        type: "fill",
        filter: ["==", "natural", "water"],
        paint: { "fill-color": theme.water, "fill-opacity": 1 },
      },
      {
        id: "footway-fill",
        ...layerSource,
        type: "fill",
        filter: [
          "any",
          ["==", "highway", "pedestrian"],
          ["==", "landuse", "construction"],
          ["==", "bridge", "yes"],
        ],
        paint: { "fill-color": theme.road, "fill-opacity": 1 },
      },
      {
        id: "landuse-green",
        ...layerSource,
        type: "fill",
        filter: [
          "any",
          ["in", "landuse", "forest", "grass", "park", "garden"],
          ["in", "leisure", "forest", "grass", "park", "garden"],
        ],
        paint: { "fill-color": theme.green, "fill-opacity": 1 },
      },
      {
        id: "garden",
        ...layerSource,
        type: "fill",
        filter: [
          "all",
          ["==", "barrier", "fence"],
          ["==", "leisure", "garden"],
        ],
        paint: { "fill-color": theme.green },
      },
      {
        id: "buildings",
        ...layerSource,
        type: "fill",
        filter: ["has", "building"],
        paint: { "fill-color": theme.building, "fill-opacity": 1 },
      },
      {
        id: "buildings-outline",
        ...layerSource,
        type: "line",
        filter: ["has", "building"],
        paint: { "line-color": theme.buildingLine, "line-width": 0.7 },
      },
      {
        id: "railway-narrow-gauge-bg",
        ...layerSource,
        type: "line",
        filter: ["==", "railway", "narrow_gauge"],
        paint: {
          "line-color": theme.railBg,
          "line-width": 3,
          "line-opacity": 0.5,
        },
      },
      {
        id: "railway-narrow-gauge",
        ...layerSource,
        type: "line",
        filter: ["==", "railway", "narrow_gauge"],
        paint: {
          "line-color": theme.railFg,
          "line-width": 1.5,
          "line-opacity": 0.7,
        },
      },
      {
        id: "roads-other",
        ...layerSource,
        type: "line",
        filter: [
          "all",
          ["has", "highway"],
          [
            "!in",
            "highway",
            "motorway",
            "trunk",
            "primary",
            "secondary",
            "footway",
            "path",
            "pedestrian",
          ],
        ],
        paint: {
          "line-color": theme.road,
          "line-width": [
            "interpolate",
            ["linear"],
            ["zoom"],
            16,
            1.5,
            17,
            2.5,
            19,
            5,
          ],
        },
      },
      {
        id: "flowerbed",
        ...layerSource,
        type: "fill",
        filter: ["==", "landuse", "flowerbed"],
        paint: { "fill-color": theme.flowerbed, "fill-opacity": 0.8 },
      },

      // トイレ
      {
        id: "toilets",
        ...layerSource,
        type: "symbol",
        filter: ["==", "amenity", "toilets"],
        minzoom: 17,
        layout: {
          "icon-image": "toilet-icon",
          ...iconStyle,
        },
      },

      // ショップ
      {
        id: "shops",
        ...layerSource,
        type: "symbol",
        filter: ["has", "shop"],
        minzoom: 18.5,
        layout: {
          "icon-image": "shop-icon",
          ...iconStyle,
          ...textStyle,
        },
        paint: {
          "text-color": theme.labelShop,
          "text-halo-color": theme.halo,
          "text-halo-width": 1.5,
        },
      },

      // レストラン
      {
        id: "restaurants",
        ...layerSource,
        type: "symbol",
        filter: ["in", "amenity", "restaurant"],
        minzoom: 16,
        layout: {
          "icon-image": "restaurant-icon",
          ...iconStyle,
          ...textStyle,
        },
        paint: {
          "text-color": theme.labelFood,
          "text-halo-color": theme.halo,
          "text-halo-width": 1.5,
        },
      },

      // カフェ
      {
        id: "cafe",
        ...layerSource,
        type: "symbol",
        filter: ["in", "amenity", "cafe"],
        minzoom: 17,
        layout: {
          "icon-image": "cafe-icon",
          ...iconStyle,
          ...textStyle,
        },

        paint: {
          "text-color": theme.labelCafe,
          "text-halo-color": theme.halo,
          "text-halo-width": 1.5,
        },
      },

      {
        id: "fast_food",
        ...layerSource,
        type: "symbol",
        filter: ["in", "amenity", "fast_food"],
        minzoom: 18,
        layout: {
          "icon-image": "fastfood-icon",
          ...iconStyle,
          ...textStyle,
        },
        paint: {
          "text-color": theme.labelFood,
          "text-halo-color": theme.halo,
          "text-halo-width": 1.5,
        },
      },

      // アトラクション
      {
        id: "attraction-labels",
        ...layerSource,
        type: "symbol",
        filter: [
          "all",
          ["!=", "$type", "LineString"], // ビッグサンダー付近の大量発生アイコン抑止
          [
            "any",
            ["has", "attraction"],
            ["all", ["==", "tourism", "attraction"], ["!=", "type", "route"]],
            ["==", "railway", "station"],
          ],
          ["has", "name"],
        ],
        minzoom: 15,
        layout: {
          "icon-image": "attraction-icon",
          ...iconStyle,
          ...textStyle,
        },
        paint: {
          "text-color": theme.labelAttraction,
          "text-halo-color": theme.halo,
          "text-halo-width": 1.5,
        },
      },
    ],
  },
};
