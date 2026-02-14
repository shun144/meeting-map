import maplibregl from "maplibre-gl";
import { PMTiles, Protocol } from "pmtiles";
import { mabashiStyle } from "@/hooks/map/mabashiStyle";

const PMTILES_URL =
  "https://nwmuhxuprqnikmbcwteo.supabase.co/storage/v1/object/public/public-maps/mabashi.pmtiles";

export const createMap = (mapContainerDiv: HTMLDivElement) => {
  const protocol = new Protocol();
  maplibregl.addProtocol("pmtiles", protocol.tile);
  const pmtiles = new PMTiles(PMTILES_URL);
  protocol.add(pmtiles);

  const maplibreglMap = new maplibregl.Map({
    container: mapContainerDiv,
    center: [139.9188144243107, 35.81436357909482],
    zoom: 18,
    maxZoom: 20,
    minZoom: 15,
    style: mabashiStyle,
    doubleClickZoom: false,
  });

  maplibreglMap.getCanvas().style.cursor = "pointer";

  return maplibreglMap;
};
