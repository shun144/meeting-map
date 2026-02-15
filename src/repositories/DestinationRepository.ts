import type { Destination } from "@/domains/Destination";
import { supabase } from "@/lib/supabase/supabaseClient";
import { toDTO, fromDB } from "./destinationMapper";
import { type Tables } from "@/lib/supabase/schema";
import { saveDestination, deleteDestination } from "@/lib/indexedDB/database";

// const DEFAULT_MAP_ID = import.meta.env.VITE_DEFAULT_MAP_ID as string;
const DEFAULT_MAP_ID = "e7d98183-5ebe-4171-a364-2eb93cc6de97";

export class DestinationRepository {
  #mapId: string;
  constructor(mapId?: string) {
    this.#mapId = mapId ?? DEFAULT_MAP_ID;
  }

  async save(destination: Destination): Promise<Destination> {
    try {
      const dto = toDTO(destination, this.#mapId);

      const { data, error } = await supabase
        .from("destination")
        .upsert(dto)
        .select("*")
        .single();

      if (error) {
        throw new Error(`目的地の保存に失敗しました: ${error.message}`);
      }

      if (!data) {
        throw new Error("目的地の保存に失敗しました");
      }

      saveDestination(dto);

      return fromDB(data as Tables<"destination">);
    } catch (error) {
      if (error instanceof Error) {
        console.error("目的地保存エラー:", error.message);
        throw error;
      }
      throw new Error("予期しないエラーが発生しました");
    }
  }

  // async findById(id: number): Promise<Destination | null> {
  //   try {
  //     const { data, error } = await supabase
  //       .from("destination")
  //       .select("*")
  //       .eq("id", id)
  //       .single();

  //     if (error) {
  //       if (error.code === "PGRST116") {
  //         return null;
  //       }
  //       throw new Error(`目的地の取得に失敗しました: ${error.message}`);
  //     }

  //     if (!data) {
  //       return null;
  //     }

  //     return fromDB(data as Tables<"destination">);
  //   } catch (error) {
  //     if (error instanceof Error) {
  //       console.error("目的地取得エラー:", error.message);
  //       throw error;
  //     }
  //     throw new Error("予期しないエラーが発生しました");
  //   }
  // }

  async findAll(): Promise<Destination[]> {
    try {
      const { data, error } = await supabase
        .from("destination")
        .select("*")
        .eq("map_id", this.#mapId);

      if (error) {
        throw new Error(`目的地一覧の取得に失敗しました: ${error.message}`);
      }

      if (!data) {
        return [];
      }

      return data.map((row) => fromDB(row as Tables<"destination">));
    } catch (error) {
      if (error instanceof Error) {
        console.error("目的地一覧取得エラー:", error.message);
        throw error;
      }
      throw new Error("予期しないエラーが発生しました");
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const { error } = await supabase
        .from("destination")
        .delete()
        .eq("id", id);

      if (error) {
        throw new Error(`目的地の削除に失敗しました: ${error.message}`);
      }

      deleteDestination([this.#mapId, id]);
    } catch (error) {
      if (error instanceof Error) {
        console.error("目的地削除エラー:", error.message);
        throw error;
      }
      throw new Error("予期しないエラーが発生しました");
    }
  }
}
