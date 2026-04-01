import { DestinationMarker } from "@/features/map/domains/DestinationMarker";

export interface IDestinationMarker {
  create: (
    dm: DestinationMarker,
    onUpdateTitle?: () => void,
    onDelete?: () => Promise<void>,
  ) => IDestinationMarker;

  popup: () => void;
  destroy: () => void;
}
