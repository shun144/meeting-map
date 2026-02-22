import type { Destination } from "@/features/map/domains/Destination";
import { Destination as DestinationClass } from "@/features/map/domains/Destination";
import { type Tables } from "@/lib/supabase/schema";

export interface DestinationDTO {
  id: number;
  title: string;
  lat: number;
  lng: number;
  map_id: string;
}

export const toDTO = (
  destination: Destination,
  mapId: string,
): DestinationDTO => {
  let lat: number;
  let lng: number;

  if (Array.isArray(destination.latlng)) {
    lng = destination.latlng[0];
    lat = destination.latlng[1];
  } else if ("lng" in destination.latlng && "lat" in destination.latlng) {
    lng = destination.latlng.lng;
    lat = destination.latlng.lat;
  } else {
    throw new Error("緯度経度の値が不正です");
  }

  const baseDTO: DestinationDTO = {
    id: destination.id,
    title: destination.title,
    lat,
    lng,
    map_id: mapId,
  };

  return baseDTO;
};

export const fromDTO = (row: Tables<"destination">): DestinationClass => {
  return new DestinationClass(row.id, [row.lng, row.lat], row.title ?? "");
};
