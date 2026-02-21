import { type Tables } from "@/lib/supabase/schema";
import { supabase } from "./supabaseClient";
import { Destination } from "@/features/map/domains/Destination";

const DEFAULT_MAP_ID = import.meta.env.VITE_DEFAULT_MAP_ID as string;

export const fetchAllDestination = async (): Promise<Destination[]> => {
  try {
    const { data, error } = await supabase.from("destination").select("*");

    if (error) {
      console.error(error.message);
      throw error;
    }

    const destinations = data.map((x) => {
      return new Destination(x.id, [x.lng, x.lat], x.title ?? "");
    });

    return destinations;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
    console.error("目的地情報の取得に失敗しました");
    return [];
  }
};

export const test = async () => {
  const { data: meta } = await supabase.from("map").select("id,updated_at");
  return meta;
};
