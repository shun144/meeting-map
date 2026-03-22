import type { Map } from "@/features/map/domains/Map";
import { Map as MapClass } from "@/features/map/domains/Map";
import { type Tables } from "@/lib/supabase/schema";

export interface MapDTO {
  id: string;
  name: string;
}

export const toDTO = (map: Map): MapDTO => {
  const dto: MapDTO = { id: map.id, name: map.name };
  return dto;
};

export const fromDTO = (row: Tables<"map">): MapClass => {
  return new MapClass(row.id, row.name);
};
