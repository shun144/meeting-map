import { type PersistenceStatus } from "@/features/map/domains/entities/Destination";
import type { Destination } from "@/features/map/domains/entities/Destination";

export interface IDestinationMarker {
  create: (
    destination: Destination,
    onUpdateTitle?: () => void,
    onDelete?: () => Promise<void>,
  ) => IDestinationMarker;

  getDestination: () => Destination;
  getStatus: () => PersistenceStatus;
  setSave: () => void;
  popup: () => void;
  addToMap: (map: unknown) => void;
  destroy: () => void;
  updateTitle: (title: string) => void;
  setError: () => void;
}
