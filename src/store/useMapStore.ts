import { create } from "zustand";
import maplibregl from "maplibre-gl";
import type DestinationMarker from "@/features/map/domains/DestinationMarker";

// interface MarkerWithId {
//   id: number;
//   title: string;
//   marker: maplibregl.Marker;
//   isNew: boolean;
// }

interface Store {
  markers: DestinationMarker[];
  addMarkers: (payload: DestinationMarker) => void;
  updateMarkers: (payload: DestinationMarker) => void;
  filterMarkers: (id: number) => void;
  cleanupMarkers: () => void;
}

export const useMapStore = create<Store>((set, get) => ({
  markers: [],
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
    const { markers } = useMapStore.getState();
    markers.find((x) => x.destination.id === id)?.element.remove();
    set((state) => ({
      markers: state.markers.filter((x) => x.destination.id !== id),
    }));
  },
  cleanupMarkers: () => {
    useMapStore.getState().markers.forEach((x) => x.element.remove());
    set({ markers: [] });
  },
}));

// import { create } from "zustand";
// import maplibregl from "maplibre-gl";
// import { fetchAllDestination } from "@/lib/supabase/supabaseFunction";
// import type { Destination } from "@/features/map/domains/Destination";
// import type { Json } from "@/lib/supabase/schema";

// interface Store {
//   map: maplibregl.Map | null;
//   isMapLoaded: boolean;
//   setIsMapLoaded: (payload: boolean) => void;
//   setMap: (payload: maplibregl.Map) => void;
//   fetchDestinations: () => Promise<void>;
//   destinations: Destination[];
//   isDestLoading: boolean;

//   currentMapInfo: {
//     src: string;
//     style: Json;
//   } | null;
//   setCurrentMapInfo: (payload: { src: string; style: Json }) => void;
// }

// export const useMapStore = create<Store>((set, get) => ({
//   map: null,
//   isMapLoaded: false,
//   isDestLoading: false,
//   setMap: (payload) => set({ map: payload }),
//   setIsMapLoaded: (payload) => set({ isMapLoaded: payload }),
//   destinations: [],
//   fetchDestinations: async () => {
//     set({ isDestLoading: true });
//     try {
//       const destinations = await fetchAllDestination();
//       set({ destinations, isDestLoading: false });
//     } catch (error) {
//       if (error instanceof Error) {
//         throw new Error(`目的地の取得に失敗しました: ${error.message}`);
//       }
//       throw new Error("目的地の取得時に予期しないエラーが発生しました");
//     }
//   },

//   currentMapInfo: null,
//   setCurrentMapInfo: (payload) => {
//     set({ currentMapInfo: payload });
//   },
// }));
