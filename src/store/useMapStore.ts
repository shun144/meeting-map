import { create } from "zustand";
import maplibregl from "maplibre-gl";
import { fetchAllDestination } from "@/lib/supabase/supabaseFunction";
import type { Destination } from "@/domains/Destination";
import type { Json } from "@/lib/supabase/schema";

interface Store {
  map: maplibregl.Map | null;
  isMapLoaded: boolean;
  setIsMapLoaded: (payload: boolean) => void;
  setMap: (payload: maplibregl.Map) => void;
  fetchDestinations: () => Promise<void>;
  destinations: Destination[];
  isDestLoading: boolean;

  currentMapInfo: {
    src: string;
    style: Json;
  } | null;
  setCurrentMapInfo: (payload: { src: string; style: Json }) => void;
}

export const useMapStore = create<Store>((set, get) => ({
  map: null,
  isMapLoaded: false,
  isDestLoading: false,
  setMap: (payload) => set({ map: payload }),
  setIsMapLoaded: (payload) => set({ isMapLoaded: payload }),
  destinations: [],
  fetchDestinations: async () => {
    set({ isDestLoading: true });
    try {
      const destinations = await fetchAllDestination();
      set({ destinations, isDestLoading: false });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`目的地の取得に失敗しました: ${error.message}`);
      }
      throw new Error("目的地の取得時に予期しないエラーが発生しました");
    }
  },

  currentMapInfo: null,
  setCurrentMapInfo: (payload) => {
    set({ currentMapInfo: payload });
  },
}));
