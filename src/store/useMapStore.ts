import type { DestinationMarker } from "@/features/map/lib/DestinationMarker";
import { create } from "zustand";

interface Store {
  markers: DestinationMarker[];
  initializeMarkers: (payload: DestinationMarker[]) => void;
  addMarkers: (payload: DestinationMarker) => void;
  updateMarkers: (payload: DestinationMarker) => void;
  filterMarkers: (id: number) => void;
  cleanupMarkers: () => void;
}

export const useMapStore = create<Store>((set, get) => ({
  markers: [],
  initializeMarkers: (payload) => set({ markers: payload }),

  addMarkers: (payload) =>
    set((state) => ({ markers: [...state.markers, payload] })),

  updateMarkers: (payload) => {
    set((state) => ({
      markers: state.markers.map((x) =>
        x.destination.id === payload.destination.id ? payload : x,
      ),
    }));
  },
  filterMarkers: (id) => {
    const { markers } = get();
    markers.find((x) => x.destination.id === id)?.element.remove();
    set((state) => ({
      markers: state.markers.filter((x) => x.destination.id !== id),
    }));
  },
  cleanupMarkers: () => {
    const { markers } = get();
    markers.forEach((x) => x.element.remove());
    set({ markers: [] });
  },
}));
