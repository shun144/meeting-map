export interface MapCache {
  id: string;
  name: string;
}

export interface PmtilesCache {
  area: string;
  version: string;
  pmtiles: ArrayBuffer;
}

export interface DestinationCache {
  map_id: string;
  id: number;
  title: string;
  lat: number;
  lng: number;
}
