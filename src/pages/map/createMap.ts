import maplibregl from "maplibre-gl";
import { PMTiles, Protocol } from "pmtiles";
import { mapStyles } from "@/config/mapStyle";

export const createMap = (mapId: string, mapContainerDiv: HTMLDivElement) => {
  const { src, style, center, zoom, maxZoom, minZoom } = getMapStyle(mapId);

  const sw = { lng: 139.8564, lat: 35.6122 };
  const ne = { lng: 139.9052, lat: 35.6538 };

  const maxBounds = new maplibregl.LngLatBounds(sw, ne);

  const protocol = new Protocol();
  maplibregl.addProtocol("pmtiles", protocol.tile);
  const pmtiles = new PMTiles(src);

  // pmtiles.getMetadata().then((metadata) => {
  //   console.log(JSON.stringify(metadata, null, 2));
  // });

  // pmtiles.getHeader().then((header) => {
  //   console.log(header);
  //   const sw = new maplibregl.LngLat(header.minLon, header.minLat);
  //   const ne = new maplibregl.LngLat(header.maxLon, header.maxLat);
  //   console.log(sw, ne);
  // });

  protocol.add(pmtiles);
  const maplibreglMap = new maplibregl.Map({
    container: mapContainerDiv,
    center,
    // center: [139.88891, 35.630511],
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
