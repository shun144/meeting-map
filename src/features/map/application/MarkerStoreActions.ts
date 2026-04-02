import type { IDestinationMarker } from "./IDestinationMarker";

export type MarkerStoreActions = {
  addMarker: (marker: IDestinationMarker) => void;
  updateMarker: (marker: IDestinationMarker) => void;
  initializeMarkers: (markers: IDestinationMarker[]) => void;
  cleanupMarkers: () => void;
};
