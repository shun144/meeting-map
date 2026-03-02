import { type MapSrcStyle } from "./types";
import { osmAttribution } from "./constants";

const PMTILES_SRC =
  "https://nwmuhxuprqnikmbcwteo.supabase.co/storage/v1/object/public/public-maps/version1/disneyland.pmtiles";

export const disneylandMapStyle: MapSrcStyle = {
  src: PMTILES_SRC,
  center: [139.8786137, 35.6339284],
  zoom: 17,
  maxZoom: 20,
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
      // 背景
      {
        id: "background",
        type: "background",
        paint: {
          "background-color": "#f9f0d8",
        },
      },

      // 地面
      {
        id: "test",
        source: "tdl",
        "source-layer": "disneyland",
        type: "fill",
        filter: [
          "any",
          ["==", "resort", "theme_park"],
          ["==", "tourism", "theme_park"],
        ],
        paint: {
          "fill-color": "#e8dcc8",
          "fill-opacity": 1,
        },
      },

      // 水域
      {
        id: "water",
        source: "tdl",
        "source-layer": "disneyland",
        type: "fill",
        filter: ["==", "natural", "water"],
        paint: {
          "fill-color": "#5bb8f5",
          "fill-opacity": 1,
        },
      },

      // 道路/橋
      {
        id: "footway-fill",
        source: "tdl",
        "source-layer": "disneyland",
        type: "fill",
        filter: [
          "any",
          ["==", "highway", "pedestrian"],
          ["==", "landuse", "construction"],
          ["==", "bridge", "yes"],
        ],
        paint: {
          "fill-color": "#f5e6c8",
          "fill-opacity": 1,
        },
      },

      // 緑地
      {
        id: "landuse-green",
        source: "tdl",
        "source-layer": "disneyland",
        type: "fill",
        filter: [
          "any",
          ["in", "landuse", "forest", "grass", "park", "garden"],
          ["in", "leisure", "forest", "grass", "park", "garden"],
        ],
        paint: {
          "fill-color": "#b8e0a0",
          "fill-opacity": 1,
        },
      },

      // 囲障付き庭園
      {
        id: "garden",
        source: "tdl",
        "source-layer": "disneyland",
        type: "fill",
        filter: [
          "all",
          ["==", "barrier", "fence"],
          ["==", "leisure", "garden"],
        ],
        paint: {
          "fill-color": "#b8e0a0",
        },
      },

      // 建物
      {
        id: "buildings",
        source: "tdl",
        "source-layer": "disneyland",
        type: "fill",
        filter: ["has", "building"],
        minzoom: 15,
        paint: {
          "fill-color": "#fde8b0",
          "fill-opacity": 1,
        },
      },

      // 建物（アウトライン）
      {
        id: "buildings-outline",
        source: "tdl",
        "source-layer": "disneyland",
        type: "line",
        filter: ["has", "building"],
        minzoom: 15,
        paint: {
          "line-color": "#d4a84b",
          "line-width": 1,
        },
      },

      // リバー鉄道の線路
      {
        id: "railway-narrow-gauge-bg",
        source: "tdl",
        "source-layer": "disneyland",
        type: "line",
        filter: ["==", "railway", "narrow_gauge"],
        paint: {
          "line-color": "#8B4513",
          "line-width": 3,
          "line-opacity": 0.6,
        },
      },
      {
        id: "railway-narrow-gauge",
        source: "tdl",
        "source-layer": "disneyland",
        type: "line",
        filter: ["==", "railway", "narrow_gauge"],
        paint: {
          "line-color": "#D4A853",
          "line-width": 1.5,
          "line-opacity": 0.7,
        },
      },

      // その他
      {
        id: "roads-other",
        source: "tdl",
        "source-layer": "disneyland",
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
          "line-color": "#ffffff",
          "line-width": [
            "interpolate",
            ["linear"],
            ["zoom"],
            16,
            1,
            17,
            2,
            19,
            4,
          ],
        },
      },

      {
        id: "flowerbed",
        source: "tdl",
        "source-layer": "disneyland",
        type: "fill",
        filter: ["==", "landuse", "flowerbed"],
        paint: {
          "fill-color": "#a8d5a2",
          "fill-opacity": 0.7,
        },
      },

      // トイレ
      {
        id: "toilets",
        source: "tdl",
        "source-layer": "disneyland",
        type: "symbol",
        filter: ["==", "amenity", "toilets"],
        minzoom: 16,
        layout: {
          "icon-image": "toilet-icon",
          "icon-size": 0.7,
          "icon-allow-overlap": true,
          "icon-ignore-placement": true,
        },
      },

      // ショップ
      {
        id: "shops",
        source: "tdl",
        "source-layer": "disneyland",
        type: "symbol",
        filter: ["has", "shop"],
        minzoom: 17,
        layout: {
          "icon-image": "shop-icon",
          "icon-size": ["interpolate", ["linear"], ["zoom"], 16, 0.6, 17, 0.5],
          "icon-allow-overlap": true,
          "icon-ignore-placement": true,
        },
      },

      // レストラン
      {
        id: "restaurants",
        source: "tdl",
        "source-layer": "disneyland",
        type: "symbol",
        filter: ["in", "amenity", "restaurant"],
        minzoom: 16,
        layout: {
          "icon-image": "restaurant-icon",
          "icon-size": ["interpolate", ["linear"], ["zoom"], 16, 0.6, 17, 0.6],
          "icon-allow-overlap": true,
          "icon-ignore-placement": true,
        },
      },

      // カフェ
      {
        id: "cafe",
        source: "tdl",
        "source-layer": "disneyland",
        type: "symbol",
        filter: ["in", "amenity", "cafe"],
        minzoom: 16,
        layout: {
          "icon-image": "cafe-icon",
          "icon-size": ["interpolate", ["linear"], ["zoom"], 16, 0.6, 17, 0.6],
          "icon-allow-overlap": true,
          "icon-ignore-placement": true,
        },
      },

      // ファストフード
      {
        id: "fast_food",
        source: "tdl",
        "source-layer": "disneyland",
        type: "symbol",
        filter: ["in", "amenity", "fast_food"],
        minzoom: 16,
        layout: {
          "icon-image": "fastfood-icon",
          "icon-size": ["interpolate", ["linear"], ["zoom"], 16, 0.4, 17, 0.5],
          "icon-allow-overlap": true,
          "icon-ignore-placement": true,
        },
      },

      // アトラクション名ラベル
      {
        id: "attraction-labels",
        source: "tdl",
        "source-layer": "disneyland",
        type: "symbol",
        filter: [
          "any",
          ["has", "attraction"],
          [
            "all",
            ["==", "tourism", "attraction"],
            ["!=", "type", "route"], // リバー鉄道の路線にラベル名がつくのを回避
          ],
          ["==", "railway", "station"],
        ],
        minzoom: 16,
        layout: {
          "text-field": ["coalesce", ["get", "name:ja"], ["get", "name"]],
          "text-font": ["Noto Sans Bold"],
          "text-size": [
            "interpolate",
            ["linear"],
            ["zoom"],
            16,
            11,
            17,
            12,
            18,
            13,
            19,
            14,
          ],
          "text-anchor": "center",
          "text-max-width": 8,
          // "text-allow-overlap": true, // ← 追加
          // "text-ignore-placement": true, // ← 追加
        },
        paint: {
          "text-color": "#c0392b",
          // "text-color": "blue",
          "text-halo-color": "#fff9e6",
          "text-halo-width": 2,
        },
      },

      // ファストフード店名
      {
        id: "fastfood-labels",
        source: "tdl",
        "source-layer": "disneyland",
        type: "symbol",
        filter: ["in", "amenity", "fast_food"],
        minzoom: 17,
        layout: {
          "text-field": ["coalesce", ["get", "name:ja"], ["get", "name"]],
          "text-font": ["Noto Sans Regular"],
          "text-size": [
            "interpolate",
            ["linear"],
            ["zoom"],
            17,
            12,
            18,
            14,
            19,
            16,
            20,
            18,
          ],
          "text-anchor": "top",
          "text-offset": [0, 1],
          "text-max-width": 10,
        },
        paint: {
          "text-color": "#e05c00",
          "text-halo-color": "#fff9e6",
          "text-halo-width": 1.5,
        },
      },

      // カフェラベル
      {
        id: "cafe-label",
        source: "tdl",
        "source-layer": "disneyland",
        type: "symbol",
        filter: ["in", "amenity", "cafe"],
        minzoom: 17,
        layout: {
          "text-field": ["coalesce", ["get", "name:ja"], ["get", "name"]],
          "text-font": ["Noto Sans Regular"],
          "text-size": [
            "interpolate",
            ["linear"],
            ["zoom"],
            17,
            12,
            18,
            14,
            19,
            16,
            20,
            18,
          ],
          "text-anchor": "top",
          "text-offset": [0, 1],
          "text-max-width": 10,
        },
        paint: {
          "text-color": "#7b4f2e",
          "text-halo-color": "#fff9e6",
          "text-halo-width": 1.5,
        },
      },

      // ショップ名ラベル
      {
        id: "shop-label",
        source: "tdl",
        "source-layer": "disneyland",
        type: "symbol",
        filter: ["has", "shop"],
        minzoom: 17,
        layout: {
          "text-field": ["coalesce", ["get", "name:ja"], ["get", "name"]],
          "text-font": ["Noto Sans Regular"],
          "text-size": [
            "interpolate",
            ["linear"],
            ["zoom"],
            17,
            12,
            18,
            14,
            19,
            16,
            20,
            18,
          ],
          "text-anchor": "top",
          "text-offset": [0, 0.5],
          "text-max-width": 10,
        },
        paint: {
          "text-color": "#7b2d8b",
          "text-halo-color": "#fff9e6",
          "text-halo-width": 1.5,
        },
      },

      // レストラン名ラベル
      {
        id: "restaurant-label",
        source: "tdl",
        "source-layer": "disneyland",
        type: "symbol",
        filter: ["in", "amenity", "restaurant"],
        minzoom: 17,
        layout: {
          "text-field": ["coalesce", ["get", "name:ja"], ["get", "name"]],
          "text-font": ["Noto Sans Regular"],
          "text-size": [
            "interpolate",
            ["linear"],
            ["zoom"],
            17,
            12,
            18,
            14,
            19,
            16,
            20,
            18,
          ],
          "text-anchor": "top",
          "text-offset": [0, 1],
          "text-max-width": 10,
        },
        paint: {
          "text-color": "#e05c00",
          "text-halo-color": "#fff9e6",
          "text-halo-width": 1.5,
        },
      },
    ],
  },
};
