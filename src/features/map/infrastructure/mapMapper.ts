import { Map } from "@/features/map/domains/Map";
import { type Tables } from "@/lib/supabase/schema";

export interface MapDTO {
  id: string;
  name: string;
}

export const fromDTO = (row: Tables<"map">): Map => {
  return new Map(row.id, row.name);
};
