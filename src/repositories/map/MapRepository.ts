import { supabase } from "@/lib/supabase/supabaseClient";

export class MapRepository {
  constructor() {}

  async fetchAll() {
    try {
      const { data, error: apiError } = await supabase
        .from("map")
        .select("id,name");

      if (apiError) {
        throw apiError;
      }

      return data;
    } catch (error) {
      return [];
    }
  }
}
