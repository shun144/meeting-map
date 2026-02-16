import { type MapSrcStyle } from "./types";

const PMTILES_SRC =
  "https://nwmuhxuprqnikmbcwteo.supabase.co/storage/v1/object/public/public-maps/version1/mabashi.pmtiles";

export const mabashiMapStyle: MapSrcStyle = {
  src: PMTILES_SRC,
  style: {
    version: 8,
    sources: {
      mabashi: {
        type: "vector",
        url: "pmtiles://" + PMTILES_SRC,
      },
    },
    layers: [
      {
        id: "background",
        type: "background",
        paint: {
          "background-color": "#f8f8f8",
        },
      },
      // 建物
      {
        id: "buildings",
        type: "fill",
        source: "mabashi",
        "source-layer": "mabashi",
        filter: ["has", "building"],
        paint: {
          "fill-color": "#d9d9d9",
          "fill-opacity": 0.8,
          "fill-outline-color": "#999",
        },
      },
      // 道路（主要道路）
      {
        id: "roads-major",
        type: "line",
        source: "mabashi",
        "source-layer": "mabashi",
        filter: [
          "in",
          ["get", "highway"],
          ["literal", ["secondary", "tertiary"]],
        ],
        paint: {
          "line-color": "#fff",
          "line-width": 6,
          "line-opacity": 0.9,
        },
      },
      // 道路（一般道路）
      {
        id: "roads-minor",
        type: "line",
        source: "mabashi",
        "source-layer": "mabashi",
        filter: [
          "in",
          ["get", "highway"],
          ["literal", ["residential", "unclassified", "service"]],
        ],
        paint: {
          "line-color": "#fff",
          "line-width": 4,
          "line-opacity": 0.8,
        },
      },
      // 道路（小道）
      {
        id: "roads-path",
        type: "line",
        source: "mabashi",
        "source-layer": "mabashi",
        filter: [
          "in",
          ["get", "highway"],
          ["literal", ["footway", "path", "steps"]],
        ],
        paint: {
          "line-color": "#ddd",
          "line-width": 2,
          "line-dasharray": [2, 2],
        },
      },
    ],
  },
};
