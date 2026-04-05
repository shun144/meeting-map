import { type IDestinationMarker } from "@/features/map/application/IDestinationMarker";
import type { IDestinationMarkerFactory } from "@/features/map/application/IDestinationMarkerFactory";
import type { Destination } from "@/features/map/domains/entities/Destination";
import { MaplibreDestinationMarker } from "@/features/map/infrastructure/maplibre/MaplibreDestinationMarker";

export class DestinationMarkerFactory implements IDestinationMarkerFactory {
  constructor() {}
  create(
    destination: Destination,
    onUpdateTitle?: (title: string) => void,
    onDelete?: () => Promise<void>,
  ): IDestinationMarker {
    return new MaplibreDestinationMarker().create(
      destination,
      onUpdateTitle,
      onDelete,
    );
  }
}
