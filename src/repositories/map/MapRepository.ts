import { supabase } from "@/lib/supabase/supabaseClient";

export class MapRepository {
  constructor() {}

  async fetchAll() {
    try {
      const { data, error: apiError } = await supabase
        .from("map")
        .select("id,name,updated_at")
        .eq("invalid_flg", false);

      if (apiError) {
        throw apiError;
      }

      return data;
    } catch (error) {
      return [];
    }
  }
}
