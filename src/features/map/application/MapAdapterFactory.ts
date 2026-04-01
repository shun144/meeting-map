import { LngLat } from "@/features/map/domains/valueObjects/LngLat";
import { type IMapAdapter } from "@/features/map/application/IMapAdapter";
import { MaplibreMapAdapter } from "@/features/map/infrastructure/maplibre/MaplibreMapAdapter";
import { DestinationMarkerService } from "@/features/map/application/DestinationMarkerService";
import SupabaseDestinationRepository from "@/features/map/infrastructure/SupabaseDestinationRepository";

export class MapAdapterFactory {
  private constructor() {}

  static async create(
    id: string,
    container: HTMLDivElement,
  ): Promise<IMapAdapter> {
    const repo = new SupabaseDestinationRepository(id);
    const service = new DestinationMarkerService(repo);

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
