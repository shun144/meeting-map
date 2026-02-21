import type { Destination } from "@/features/map/domains/Destination";
import type { DestinationRepository } from "@/features/map/domains/DestinationRepository";
import { supabase } from "@/lib/supabase/supabaseClient";
import { toDTO, fromDTO } from "./destinationMapper";
import { type Tables } from "@/lib/supabase/schema";
import {
  saveDestination as saveCachedDestination,
  deleteDestination as deleteCachedDestination,
} from "@/lib/indexedDB/database";

export default class SupabaseDestinationRepository implements DestinationRepository {
  #mapId: string;
  constructor(mapId: string) {
    this.#mapId = mapId;
  }

  async save(destination: Destination): Promise<void> {
    const dto = toDTO(destination, this.#mapId);
    const { error } = await supabase.from("destination").upsert(dto);

    if (error) {
      throw new Error(`目的地の保存に失敗しました: ${error.message}`);
    }

    await saveCachedDestination(dto).catch((e) =>
      console.error("目的地のキャッシュ保存に失敗しました", e),
    );
  }

  async findAll(): Promise<Destination[]> {
    const { data, error } = await supabase
      .from("destination")
      .select("*")
      .eq("map_id", this.#mapId);

    if (error) {
      throw new Error(`目的地一覧の取得に失敗しました: ${error.message}`);
    }
    return data.map((row) => fromDTO(row as Tables<"destination">));
  }

  async delete(id: number): Promise<void> {
    const { error } = await supabase.from("destination").delete().eq("id", id);

    if (error) {
      throw new Error(`目的地の削除に失敗しました: ${error.message}`);
    }

    await deleteCachedDestination([this.#mapId, id]).catch((e) =>
      console.error("キャッシュの目的地削除に失敗しました:", e),
    );
  }
}
