import maplibregl from "maplibre-gl";
import { PMTiles, Protocol } from "pmtiles";
import { mabashiStyle } from "@/hooks/map/mabashiStyle";
import { mapStyle } from "@/hooks/map/mapStyle";

const MABASHI_PMTILES_URL =
  "https://nwmuhxuprqnikmbcwteo.supabase.co/storage/v1/object/public/public-maps/version1/mabashi.pmtiles";

// const PMTILES_URL =
//   "https://nwmuhxuprqnikmbcwteo.supabase.co/storage/v1/object/public/public-maps/version1/disneyland.pmtiles";

export const createMap = (mapContainerDiv: HTMLDivElement) => {
  const protocol = new Protocol();
  maplibregl.addProtocol("pmtiles", protocol.tile);
  const pmtiles = new PMTiles(MABASHI_PMTILES_URL);
  protocol.add(pmtiles);

  const maplibreglMap = new maplibregl.Map({
    container: mapContainerDiv,
    center: [139.9188144243107, 35.81436357909482],
    zoom: 18,
    maxZoom: 20,
    minZoom: 15,
    style: mabashiStyle,
    // style: mapStyle,
    doubleClickZoom: false,
  });

  maplibreglMap.getCanvas().style.cursor = "pointer";

  return maplibreglMap;
};
