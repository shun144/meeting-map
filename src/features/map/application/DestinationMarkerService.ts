import type { DestinationRepository } from "@/features/map/domains/DestinationRepository";
import { useMapStore } from "@/store/useMapStore";
import { Destination } from "@/features/map/domains/Destination";
import {
  DestinationMarker,
  type DestinationMarkerStatus,
} from "@/features/map/lib/DestinationMarker";
import { toast } from "react-toastify";

export class DestinationMarkerService {
  constructor(private readonly repo: DestinationRepository) {}

  private addDestinationMarker(dm: DestinationMarker) {
    useMapStore.getState().addMarkers(dm);
    this.repo
      .add(dm.destination)
      .then(() => (dm.status = "SAVED"))
      .catch((error) => {
        console.error(error.message);
        toast.error("目的地の保存に失敗しました");
        dm.element.setOpacity("0.5");
      });
  }

  private saveDestinationMarker(dm: DestinationMarker, title: string) {
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
  }

  private updateDestinationMarker(dm: DestinationMarker) {
    this.repo
      .update(dm.destination)
      .then(() => useMapStore.getState().updateMarkers(dm))
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
      .then(() => useMapStore.getState().filterMarkers(dm.destination.id))
      .catch((error) => {
        const message =
          error instanceof Error && error.message
            ? error.message
            : "目的地の削除に失敗しました";
        toast.error(message);
        dm.restoreFromDummyDelete();
      });
  }

  createNewDestinationMarker = (destination: Destination) => {
    const onChangeInput = (title: string) =>
      this.saveDestinationMarker(dm, title);

    const onClickDelete = (title: string) => {
      if (title !== "" && !confirm("この目的地を削除しますか？")) {
        return;
      }
      this.deleteDestinationMarker(dm);
    };

    const dm = new DestinationMarker(
      destination,
      "NEW",
      onChangeInput,
      onClickDelete,
    );

    return dm;
  };

  restoreDestinationMarker = (destinations: Destination[]) => {
    const dms = destinations.map((d) => {
      const onChangeInput = (title: string) =>
        this.saveDestinationMarker(dm, title);

      const onClickDelete = (title: string) => {
        if (title !== "" && !confirm("この目的地を削除しますか？")) {
          return;
        }
        this.deleteDestinationMarker(dm);
      };

      const dm = new DestinationMarker(
        d,
        "SAVED",
        onChangeInput,
        onClickDelete,
      );
      return dm;
    });

    useMapStore.getState().initializeMarkers(dms);
    return dms;
  };
}
