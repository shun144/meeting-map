import { type IDestinationMarker } from "@/features/map/application/IDestinationMarker";
import { Destination } from "@/features/map/domains/entities/Destination";
import { type DestinationRepository } from "@/features/map/domains/repositories/DestinationRepository";
import { toast } from "react-toastify";
import type { IDestinationMarkerFactory } from "./IDestinationMarkerFactory";
import type { MarkerStoreActions } from "./MarkerStoreActions";

export class DestinationService {
  constructor(
    private readonly repo: DestinationRepository,
    private readonly markerFactory: IDestinationMarkerFactory,
    private readonly storeActions: MarkerStoreActions,
  ) {}

  private saveDestinationMarker(marker: IDestinationMarker, title: string) {
    marker.updateDestination(title);

    switch (marker.getStatus()) {
      case "NEW":
        this.storeActions.addMarker(marker);
        this.repo
          .add(marker.getDestination())
          .then(() => marker.setSave())
          .catch((error) => {
            console.error(error.message);
            toast.error("目的地の保存に失敗しました");
            marker.setError();
          });

        break;
      case "SAVED":
        this.repo
          .update(marker.getDestination())
          .then(() => this.storeActions.updateMarker(marker))
          .catch((error) => {
            console.error(error.message);
            toast.error("目的地の更新に失敗しました");
            marker.setError();
          });
        break;
      default:
        console.error("想定外のタイプです");
        break;
    }
  }

  createNewDestinationMarker(destination: Destination) {
    const marker = this.markerFactory.create(
      destination,
      (title: string) => this.saveDestinationMarker(marker, title),
      () => this.repo.delete(destination.id),
    );

    return marker;
  }

  restoreDestinationMarker(destinations: Destination[]) {
    const markers = destinations.map((destination) => {
      const marker = this.markerFactory.create(
        destination,
        (title: string) => this.saveDestinationMarker(marker, title),
        () => this.repo.delete(destination.id),
      );
      return marker;
    });

    this.storeActions.initializeMarkers(markers);
    return markers;
  }
}
