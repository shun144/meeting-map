import { supabase } from "@/lib/supabase/supabaseClient";
import { Map } from "@/features/map/domains/entities/Map";
import { fromDTO } from "@/features/map/infrastructure/supabase/mapMapper";
import type { Tables } from "@/lib/supabase/schema";
import { type MapRepository } from "@/features/map/domains/repositories/MapRepository";

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

  async isExist(id: string) {
    const { count, error } = await supabase
      .from("map")
      .select("id", { count: "exact", head: true })
      .eq("id", id)
      .eq("invalid_flg", false);

    if (error) throw new Error(error.message);
    return (count ?? 0) > 0;
  }
}
