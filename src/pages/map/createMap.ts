import maplibregl from "maplibre-gl";
import { PMTiles, Protocol } from "pmtiles";
import { mapStyles } from "@/config/mapStyle";

export const createMap = (mapId: string, mapContainerDiv: HTMLDivElement) => {
  const { src, style, center, zoom, maxZoom, minZoom } = getMapStyle(mapId);

  // const sw = new maplibregl.LngLat(139.84, 35.61);
  // const ne = new maplibregl.LngLat(139.92, 35.66);
  // const sw = new maplibregl.LngLat(139.87911222474622, 35.63386970823866);
  // const ne = new maplibregl.LngLat(139.87652657525575, 35.63193168001513);

  // 元の座標（SW・NEが逆転しているので修正も兼ねて）
  const centerLng = (139.87911222474622 + 139.87652657525575) / 2; // 約139.878
  const centerLat = (35.63386970823866 + 35.63193168001513) / 2; // 約35.633

  // 1km四方ずつ広げる（各方向に1km = 合計2km広がる）
  const deltaLat = 0.009; // 1km分
  const deltaLng = 0.012; // 1km分（緯度35°付近）

  const sw = new maplibregl.LngLat(
    Math.min(139.87911222474622, 139.87652657525575) - deltaLng, // 139.864
    Math.min(35.63386970823866, 35.63193168001513) - deltaLat, // 35.623
  );
  const ne = new maplibregl.LngLat(
    Math.max(139.87911222474622, 139.87652657525575) + deltaLng, // 139.891
    Math.max(35.63386970823866, 35.63193168001513) + deltaLat, // 35.643
  );

  const maxBounds = new maplibregl.LngLatBounds(sw, ne);

  const protocol = new Protocol();
  maplibregl.addProtocol("pmtiles", protocol.tile);
  const pmtiles = new PMTiles(src);
  protocol.add(pmtiles);
  const maplibreglMap = new maplibregl.Map({
    container: mapContainerDiv,
    center,
    zoom,
    maxZoom,
    minZoom,
    maxBounds,
    style,
    doubleClickZoom: false,
  });

  maplibreglMap.getCanvas().style.cursor = "pointer";
  return maplibreglMap;
};

const getMapStyle = (mapId: string) => {
  return mapStyles[mapId];
};
