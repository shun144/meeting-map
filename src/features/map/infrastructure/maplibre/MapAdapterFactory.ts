import { DestinationMarkerService } from "@/features/map/application/DestinationMarkerService";
import { type IMapAdapter } from "@/features/map/application/IMapAdapter";
import { MaplibreMapAdapter } from "@/features/map/infrastructure/maplibre/MaplibreMapAdapter";
import SupabaseDestinationRepository from "@/features/map/infrastructure/SupabaseDestinationRepository";
import { DestinationMarkerFactory } from "./DestinationMarkerFactory";
import type { MarkerStoreActions } from "../../application/MarkerStoreActions";

export class MapAdapterFactory {
  private constructor() {}

  static async create(
    id: string,
    container: HTMLDivElement,
    storeActions: MarkerStoreActions,
  ): Promise<IMapAdapter> {
    const repo = new SupabaseDestinationRepository(id);
    const markerFactory = new DestinationMarkerFactory();
    const service = new DestinationMarkerService(
      repo,
      markerFactory,
      storeActions,
    );

    const initialDestinations = await repo.findAll();
    const initialDestinationMarkers =
      service.restoreDestinationMarker(initialDestinations);

    const adapter = new MaplibreMapAdapter(
      id,
      service,
      initialDestinationMarkers,
    );
    adapter.init(container);
    return adapter;
  }
}
