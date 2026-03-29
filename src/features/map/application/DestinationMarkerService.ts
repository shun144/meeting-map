import type { DestinationRepository } from "@/features/map/domains/DestinationRepository";
import { useMapStore } from "@/store/useMapStore";
import { Destination } from "@/features/map/domains/Destination";
import {
  DestinationMarker,
  type DestinationMarkerStatus,
} from "@/features/map/lib/DestinationMarker";
import { toast } from "react-toastify";

export class DestinationMarkerService {
  addMarkers: (payload: DestinationMarker) => void;
  updateMarkers: (payload: DestinationMarker) => void;
  filterMarkers: (id: number) => void;
  constructor(private readonly repo: DestinationRepository) {
    const { addMarkers, updateMarkers, filterMarkers } = useMapStore.getState();
    this.addMarkers = addMarkers;
    this.updateMarkers = updateMarkers;
    this.filterMarkers = filterMarkers;
  }

  private addDestinationMarker(dm: DestinationMarker) {
    this.addMarkers(dm);
    this.repo
      .add(dm.destination)
      .then(() => (dm.status = "SAVED"))
      .catch((error) => {
        console.error(error.message);
        toast.error("目的地の保存に失敗しました");
        dm.element.setOpacity("0.5");
      });
  }

  private updateDestinationMarker(dm: DestinationMarker) {
    this.repo
      .update(dm.destination)
      .then(() => this.updateMarkers(dm))
      .catch((error) => {
        console.error(error.message);
        toast.error("目的地の更新に失敗しました");
        dm.element.setOpacity("0.5");
      });
  }

  private deleteDestinationMarker(dm: DestinationMarker) {
    dm.dummyDelete();
    this.repo
      .delete(dm.destination.id)
      .then(() => this.filterMarkers(dm.destination.id))
      .catch((error) => {
        const message =
          error instanceof Error && error.message
            ? error.message
            : "目的地の削除に失敗しました";
        toast.error(message);
        dm.restoreFromDummyDelete();
      });
  }

  createDestinationMarker = (
    destination: Destination,
    status: DestinationMarkerStatus,
  ) => {
    const onChangeInput = (title: string) => {
      dm.destination = new Destination(
        dm.destination.id,
        dm.destination.lnglat,
        title,
      );

      switch (dm.status) {
        case "NEW":
          this.addDestinationMarker(dm);
          break;
        case "SAVED":
          this.updateDestinationMarker(dm);
          break;
        default:
          console.error("想定外のタイプです");
          break;
      }
    };

    const onClickDelete = (title: string) => {
      if (title !== "" && !confirm("この目的地を削除しますか？")) {
        return;
      }
      this.deleteDestinationMarker(dm);
    };

    const dm = new DestinationMarker(
      destination,
      status,
      onChangeInput,
      onClickDelete,
    );

    return dm;
  };
}
