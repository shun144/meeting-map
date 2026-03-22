import { supabase } from "@/lib/supabase/supabaseClient";
import { Map } from "@/features/map/domains/Map";
import { fromDTO } from "@/features/map/infrastructure/mapMapper";
import type { Tables } from "@/lib/supabase/schema";
import { type MapRepository } from "@/features/map/domains//MapRepository";

export class SupabaseMapRepository implements MapRepository {
  constructor() {}

  async findAll(): Promise<Map[]> {
    const { data, error } = await supabase
      .from("map")
      .select("id,name,updated_at")
      .eq("invalid_flg", false);
    if (error) throw new Error(error.message);
    return data.map((x) => fromDTO(x as Tables<"map">));
  }

  async find(id: string) {
    const { data, error } = await supabase
      .from("map")
      .select("id")
      .eq("id", id)
      .eq("invalid_flg", false)
      .single();

    if (error) throw new Error(error.message);
    return fromDTO(data as Tables<"map">);
  }
}
