export interface MapCache {
  id: string;
  name: string;
  updated_at: string;
}

export interface PmtilesCache {
  area: string;
  version: string;
  pmtiles: ArrayBuffer;
}

export interface DestinationCache {
  map_id: string;
  id: number;
  title: string | null;
  lat: number;
  lng: number;
  updated_at: string;
}
