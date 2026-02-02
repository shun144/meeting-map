import { create } from "zustand";
import maplibregl from "maplibre-gl";

interface Store {
  map: maplibregl.Map | null;
  isLoaded: boolean;
  setMap: (payload: maplibregl.Map) => void;
  setIsLoaded: (payload: boolean) => void;
}

export const useMapStore = create<Store>((set, get) => ({
  map: null,
  isLoaded: false,
  setMap: (payload) => set({ map: payload }),
  setIsLoaded: (payload) => set({ isLoaded: payload }),
}));
