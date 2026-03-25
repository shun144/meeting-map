import { Destination } from "@/features/map/domains/Destination";
import { type Tables } from "@/lib/supabase/schema";

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
  return new Destination(row.id, { lng: row.lng, lat: row.lat }, row.title);
};
