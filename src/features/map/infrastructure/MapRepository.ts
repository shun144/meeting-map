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

  async find(id: string | undefined) {
    if (id === undefined) return null;
    const { data, error } = await supabase
      .from("map")
      .select("id")
      .eq("id", id)
      .eq("invalid_flg", false)
      .single();

    if (error) {
      console.error(`地図存在確認エラー：${error.message}`);
      return null;
    }

    return data;
  }
}
