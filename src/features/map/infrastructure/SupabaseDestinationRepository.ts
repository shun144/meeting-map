import type { Destination } from "@/features/map/domains/Destination";
import type { DestinationRepository } from "@/features/map/domains/DestinationRepository";
import { supabase } from "@/lib/supabase/supabaseClient";
import { toDTO, fromDTO } from "./destinationMapper";
import { type Tables } from "@/lib/supabase/schema";
import {
  saveDestination as saveCachedDestination,
  deleteDestination as deleteCachedDestination,
} from "@/lib/indexedDB/database";
import { markerMaxLength } from "@/features/map/constants";

export default class SupabaseDestinationRepository implements DestinationRepository {
  #mapId: string;
  constructor(mapId: string) {
    this.#mapId = mapId;
  }

  async add(destination: Destination): Promise<void> {
    const { data: existing } = await supabase
      .from("destination")
      .select("id")
      .eq("map_id", this.#mapId);

    if (existing && existing.length >= markerMaxLength) {
      throw new Error(
        `すでに目的地作成上限数（${markerMaxLength}）に達しています。画面を更新してください`,
      );
    }

    const dto = toDTO(destination, this.#mapId);
    const { data, error } = await supabase
      .from("destination")
      .upsert(dto)
      .select("map_id,id,title,lat,lng,updated_at")
      .single();

    if (error) throw new Error(`目的地の保存に失敗しました: ${error.message}`);
    await saveCachedDestination(data).catch((e) =>
      console.error("目的地のキャッシュ保存に失敗しました", e),
    );
  }

  async update(destination: Destination): Promise<void> {
    const dto = toDTO(destination, this.#mapId);
    const { data, error } = await supabase
      .from("destination")
      .update(dto)
      .eq("id", destination.id)
      .select("map_id,id,title,lat,lng,updated_at")
      .single();

    if (error) throw new Error(`目的地の更新に失敗しました: ${error.message}`);
    await saveCachedDestination(data).catch((e) =>
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
