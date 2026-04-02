import type { IDestinationMarker } from "@/features/map/application/IDestinationMarker";
import { create } from "zustand";

interface Store {
  markers: IDestinationMarker[];
  initializeMarkers: (payload: IDestinationMarker[]) => void;
  addMarker: (payload: IDestinationMarker) => void;
  updateMarker: (payload: IDestinationMarker) => void;
  filterMarkers: (id: number) => void;
  cleanupMarkers: () => void;
}

export const useMapStore = create<Store>((set, get) => ({
  markers: [],
  initializeMarkers: (payload) => set({ markers: payload }),

  addMarker: (payload) =>
    set((state) => ({ markers: [...state.markers, payload] })),

  updateMarker: (payload) => {
    set((state) => ({
      markers: state.markers.map((x) =>
        x.getDestination().id === payload.getDestination().id ? payload : x,
      ),
    }));
  },
  filterMarkers: (id) => {
    const { markers } = get();
    markers.find((x) => x.getDestination().id === id)?.destroy();
    set((state) => ({
      markers: state.markers.filter((x) => x.getDestination().id !== id),
    }));
  },
  cleanupMarkers: () => {
    const { markers } = get();
    markers.forEach((x) => x.destroy());
    set({ markers: [] });
  },
}));
