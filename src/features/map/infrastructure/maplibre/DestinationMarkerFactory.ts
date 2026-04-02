import { DestinationMarker } from "@/features/map/domains/DestinationMarker";
import { MaplibreDestinationMarker } from "@/features/map/infrastructure/maplibre/MaplibreDestinationMarker";
import { type IDestinationMarker } from "@/features/map/application/IDestinationMarker";
import type { IDestinationMarkerFactory } from "@/features/map/application/IDestinationMarkerFactory";

export class DestinationMarkerFactory implements IDestinationMarkerFactory {
  constructor() {}
  create(
    dm: DestinationMarker,
    onUpdateTitle?: (title: string) => void,
    onDelete?: () => Promise<void>,
  ): IDestinationMarker {
    return new MaplibreDestinationMarker().create(dm, onUpdateTitle, onDelete);
  }
}
