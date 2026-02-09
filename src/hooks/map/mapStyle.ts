const PMTILES_URL =
  "https://nwmuhxuprqnikmbcwteo.supabase.co/storage/v1/object/public/public-maps/disneyland.pmtiles";

export const mapStyle: maplibregl.StyleSpecification = {
  version: 8,
  glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
  sources: {
    tdl: {
      type: "vector",
      url: "pmtiles://" + PMTILES_URL,
      attribution: "© OpenStreetMap",
      maxzoom: 14,
    },
  },
  layers: [
    // 背景
    {
      id: "background",
      type: "background",
      paint: {
        "background-color": "#f0f0f0",
      },
    },

    // 緑地・公園
    {
      id: "landuse-green",
      source: "tdl",
      "source-layer": "disneyland",
      type: "fill",
      filter: ["in", "landuse", "forest", "grass", "park", "garden"],
      paint: {
        "fill-color": "#d4edda",
        "fill-opacity": 0.6,
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
        "fill-color": "#aad3df",
        "fill-opacity": 0.8,
      },
    },

    // 建物（基本）
    {
      id: "buildings",
      source: "tdl",
      "source-layer": "disneyland",
      type: "fill",
      filter: ["has", "building"],
      minzoom: 15,
      paint: {
        "fill-color": "#e0e0e0",
        "fill-opacity": 0.7,
      },
    },

    {
      id: "buildings-outline",
      source: "tdl",
      "source-layer": "disneyland",
      type: "line",
      filter: ["has", "building"],
      minzoom: 15,
      paint: {
        "line-color": "#bdbdbd",
        "line-width": 1,
      },
    },

    // // アトラクション（目立つ色）
    // {
    //   id: "attractions",
    //   source: "tdl",
    //   "source-layer": "disneyland",
    //   type: "fill",
    //   filter: ["has", "attraction"],
    //   paint: {
    //     "fill-color": "#ffebcd",
    //     "fill-opacity": 0.9,
    //   },
    // },

    // {
    //   id: "attractions-outline",
    //   source: "tdl",
    //   "source-layer": "disneyland",
    //   type: "line",
    //   filter: ["has", "attraction"],
    //   paint: {
    //     "line-color": "#ff9800",
    //     "line-width": 2,
    //   },
    // },

    // 道路（幅と色を改善）
    {
      id: "roads",
      source: "tdl",
      "source-layer": "disneyland",
      type: "line",
      filter: ["has", "highway"],
      // minzoom: 16,
      paint: {
        "line-color": [
          "match",
          ["get", "highway"],
          ["motorway", "trunk"],
          "#e892a2", // 主要道路: ピンク系
          ["primary", "secondary"],
          "#fcd6a4", // 一般道路: 薄オレンジ
          ["footway", "path", "pedestrian"],
          "#dddde8", // 歩道: 薄グレー
          "#ffffff", // その他: 白
        ],
        "line-width": [
          "interpolate",
          ["linear"],
          ["zoom"],
          16,
          0.5,
          17,
          1,
          19,
          6,
        ],
      },
    },

    // ショップ
    {
      id: "shops",
      source: "tdl",
      "source-layer": "disneyland",
      type: "symbol",
      filter: ["has", "shop"],
      minzoom: 16,
      layout: {
        "text-field": "🏠",
        "text-size": 12,
        "text-allow-overlap": true, // シンボルの重なりを許可
        "text-ignore-placement": false, // false→別のラベルをよけてラベル表示
        "symbol-avoid-edges": false, // 画面端でも表示
      },
      paint: {
        "text-color": "#7b1fa2",
        "text-halo-color": "#ffffff",
        "text-halo-width": 1,
        "text-opacity": 0.7,
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
        "text-field": "🍴",
        "text-size": 15,
        "text-allow-overlap": true, // シンボルの重なりを許可
        "text-ignore-placement": false, // false→別のラベルをよけてラベル表示
        "symbol-avoid-edges": false, // 画面端でも表示
      },
      paint: {
        "text-color": "#558b2f", // メインの色（トマトレッド）
        "text-halo-color": "#ffffff", // 縁取りの色（白）
        "text-halo-width": 1, // 縁取りの太さ
        "text-opacity": 0.8, // 不透明度（0-1）
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
        "text-field": "🍵",
        "text-size": 14,
        "text-allow-overlap": true, // シンボルの重なりを許可
        "text-ignore-placement": false, // false→別のラベルをよけてラベル表示
        "symbol-avoid-edges": false, // 画面端でも表示
      },
      paint: {
        "text-color": "blue",
        "text-halo-color": "#ffffff", // 縁取りの色（白）
        "text-halo-width": 2, // 縁取りの太さ
        "text-opacity": 0.8, // 不透明度（0-1）
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
        "text-field": "🍔",
        "text-size": 14,
        "text-allow-overlap": true, // シンボルの重なりを許可
        "text-ignore-placement": false, // false→別のラベルをよけてラベル表示
        "symbol-avoid-edges": false, // 画面端でも表示
      },
      paint: {
        "text-color": "#ff6347",
        "text-halo-color": "#ffffff", // 縁取りの色（白）
        "text-halo-width": 2, // 縁取りの太さ
        "text-opacity": 0.8, // 不透明度（0-1）
      },
    },

    // アトラクション名（重要施設 - OSM標準より少し大きめ）
    {
      id: "attraction-labels",
      source: "tdl",
      "source-layer": "disneyland",
      type: "symbol",
      // filter: ["==", "tourism", "attraction"],
      filter: ["has", "attraction"],
      minzoom: 16,
      layout: {
        "text-field": ["coalesce", ["get", "name:ja"], ["get", "name"]],
        "text-font": ["Noto Sans Bold"],
        "text-size": [
          "interpolate",
          ["linear"],
          ["zoom"],
          16,
          11, // z16: 11px
          17,
          12, // z17: 12px
          18,
          13, // z18: 13px
          19,
          14, // z19: 14px
        ],
        "text-anchor": "center",
        "text-max-width": 8,
      },
      paint: {
        "text-color": "#d32f2f",
        "text-halo-color": "#ffffff",
        "text-halo-width": 1.5,
      },
    },

    // レストラン・ショップ名（OSM標準サイズ）
    {
      id: "amenity-labels",
      source: "tdl",
      "source-layer": "disneyland",
      type: "symbol",
      filter: [
        "any",
        ["in", "amenity", "restaurant", "cafe", "fast_food"],
        ["has", "shop"],
      ],
      minzoom: 17,
      layout: {
        "text-field": ["coalesce", ["get", "name:ja"], ["get", "name"]],
        "text-font": ["Noto Sans Regular"],
        "text-size": [
          "interpolate",
          ["linear"],
          ["zoom"],
          17,
          12, // 大きめに
          18,
          14,
          19,
          16,
          20,
          18, // さらに拡大時も対応
          // 17,
          // 9, // z17: 9px
          // 18,
          // 10, // z18: 10px
          // 19,
          // 11, // z19: 11px
        ],
        "text-anchor": "center",
        "text-max-width": 10,
      },
      paint: {
        "text-color": "#666666",
        "text-halo-color": "#ffffff",
        "text-halo-width": 1.5,
      },
    },

    // その他施設名（小さめ・OSM標準）
    {
      id: "labels-facilities",
      source: "tdl",
      "source-layer": "disneyland",
      type: "symbol",
      filter: [
        "all",
        ["has", "name"],
        ["!=", "tourism", "attraction"],
        ["!has", "amenity"],
        ["!has", "shop"],
      ],
      minzoom: 18,
      layout: {
        "text-field": ["coalesce", ["get", "name:ja"], ["get", "name"]],
        "text-font": ["Noto Sans Regular"],
        "text-size": [
          "interpolate",
          ["linear"],
          ["zoom"],
          18,
          8, // z18: 8px
          19,
          9, // z19: 9px
        ],
        "text-anchor": "center",
        "text-max-width": 10,
      },
      paint: {
        "text-color": "#888888",
        "text-halo-color": "#ffffff",
        "text-halo-width": 1,
      },
    },
  ],
};
