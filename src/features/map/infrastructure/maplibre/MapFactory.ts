import { DestinationService } from "@/features/map/application/DestinationService";
import { type IMap } from "@/features/map/application/IMap";
import { MaplibreMap } from "@/features/map/infrastructure/maplibre/MaplibreMap";
import SupabaseDestinationRepository from "@/features/map/infrastructure/supabase/SupabaseDestinationRepository";
import { DestinationMarkerFactory } from "./DestinationMarkerFactory";
import type { MarkerStoreActions } from "@/features/map/application/MarkerStoreActions";

export class MapFactory {
  private constructor() {}

  static async create(
    id: string,
    container: HTMLDivElement,
    storeActions: MarkerStoreActions,
  ): Promise<IMap> {
    const repo = new SupabaseDestinationRepository(id);
    const markerFactory = new DestinationMarkerFactory();
    const service = new DestinationService(repo, markerFactory, storeActions);

    const initialDestinations = await repo.findAll();
    const initialDestinationMarkers =
      service.restoreDestinationMarker(initialDestinations);
    const maplibreMap = new MaplibreMap(id, service, initialDestinationMarkers);
    maplibreMap.init(container);
    return maplibreMap;
  }
}
