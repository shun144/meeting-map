import type { DestinationMarker } from "../domains/DestinationMarker";
import type { IDestinationMarker } from "./IDestinationMarker";

export interface IDestinationMarkerFactory {
  create(
    dm: DestinationMarker,
    onUpdateTitle?: (title: string) => void,
    onDelete?: () => Promise<void>,
  ): IDestinationMarker;
}
