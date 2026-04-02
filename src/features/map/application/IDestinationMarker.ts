import {
  DestinationMarker,
  type DestinationMarkerStatus,
} from "@/features/map/domains/entities/DestinationMarker";
import type { Destination } from "../domains/entities/Destination";
import type { LngLat } from "../domains/valueObjects/LngLat";

export interface IDestinationMarker {
  create: (
    dm: DestinationMarker,
    onUpdateTitle?: () => void,
    onDelete?: () => Promise<void>,
  ) => IDestinationMarker;

  getDestination: () => Destination;
  getStatus: () => DestinationMarkerStatus;
  setSave: () => void;
  popup: () => void;
  addToMap: (map: unknown) => void;
  destroy: () => void;
  updateDestination: (lngLat: LngLat, title: string) => void;
  setError: () => void;
}
