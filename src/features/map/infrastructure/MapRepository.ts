import { supabase } from "@/lib/supabase/supabaseClient";

export class MapRepository {
  constructor() {}

  async fetchAll() {
    const { data, error } = await supabase
      .from("map")
      .select("id,name,updated_at")
      .eq("invalid_flg", false);

    if (error) throw error;

    return data ?? [];
  }
}
