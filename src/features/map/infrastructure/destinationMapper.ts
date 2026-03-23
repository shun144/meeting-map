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

// TODO:https://claude.ai/chat/997bf97c-7a30-477f-9da1-2fea1beae366
export const toDTO = (
  destination: Destination,
  mapId: string,
): DestinationDTO => {
  let lat: number;
  let lng: number;

  if (Array.isArray(destination.lnglat)) {
    lng = destination.lnglat[0];
    lat = destination.lnglat[1];
  } else if ("lng" in destination.lnglat && "lat" in destination.lnglat) {
    lng = destination.lnglat.lng;
    lat = destination.lnglat.lat;
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
  return new DestinationClass(
    row.id,
    { lng: row.lng, lat: row.lat },
    row.title ?? "",
  );
};
