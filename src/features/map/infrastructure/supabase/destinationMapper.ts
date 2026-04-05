import { Destination } from "@/features/map/domains/entities/Destination";
import { type Tables } from "@/lib/supabase/schema";
import { LngLat } from "@/features/map/domains/valueObjects/LngLat";

export interface DestinationDTO {
  id: number;
  title: string;
  lat: number;
  lng: number;
  map_id: string;
}

export const toDTO = (destination: Destination, mapId: string) => {
  const dto: DestinationDTO = {
    id: destination.id,
    title: destination.title,
    lat: destination.lnglat.lat,
    lng: destination.lnglat.lng,
    map_id: mapId,
  };

  return dto;
};

export const fromDTO = (row: Tables<"destination">): Destination => {
  const lngLat = new LngLat(row.lng, row.lat);
  return new Destination(row.id, lngLat, row.title ?? "");
};
