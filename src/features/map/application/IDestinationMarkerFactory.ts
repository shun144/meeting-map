import type { Destination } from "@/features/map/domains/entities/Destination";
import type { IDestinationMarker } from "@/features/map/application/IDestinationMarker";

export interface IDestinationMarkerFactory {
  create(
    destination: Destination,
    onUpdateTitle?: (title: string) => void,
    onDelete?: () => Promise<void>,
  ): IDestinationMarker;
}
