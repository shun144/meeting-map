import type { Destination } from "@/domains/Destination";
import { Destination as DestinationClass } from "@/domains/Destination";
import { type Tables } from "@/lib/supabase/schema";

export type DestinationDTO = {
  id: number;
  title: string;
  lat: number;
  lng: number;
  map_id: string;
};

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
    throw new Error("Invalid latlng format");
  }

  const baseDTO: DestinationDTO = {
    id: destination.id === 0 ? Date.now() : destination.id,
    title: destination.title,
    lat,
    lng,
    map_id: mapId,
  };

  return baseDTO;
};

export const fromDB = (row: Tables<"destination">): Destination => {
  return new DestinationClass(row.id, [row.lng, row.lat], row.title ?? "");
};
