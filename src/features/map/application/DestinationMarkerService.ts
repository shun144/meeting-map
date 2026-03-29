import type { DestinationRepository } from "@/features/map/domains/DestinationRepository";
import { useMapStore } from "@/store/useMapStore";
import { Destination } from "@/features/map/domains/Destination";
import DestinationMarker from "../lib/DestinationMarker";
import { toast } from "react-toastify";

type DestinationMarkerStatus = "NEW" | "SAVED";

export class DestinationMarkerService {
  constructor(private readonly repo: DestinationRepository) {}

  createDestinationMarker = (
    destination: Destination,
    status: DestinationMarkerStatus,
  ) => {
    const { addMarkers, updateMarkers, filterMarkers } = useMapStore.getState();

    const onChangeInput = (title: string) => {
      dm.destination = new Destination(
        dm.destination.id,
        dm.destination.lnglat,
        title,
      );

      if (dm.status === "NEW") {
        addMarkers(dm);
        this.repo
          .add(dm.destination)
          .then(() => {
            dm.status = "SAVED";
          })
          .catch((error) => {
            console.error(error.message);
            toast.error("目的地の保存に失敗しました");
            dm.element.setOpacity("0.5");
          });
        return;
      }

      this.repo
        .update(dm.destination)
        .then(() => updateMarkers(dm))
        .catch((error) => {
          console.error(error.message);
          toast.error("目的地の更新に失敗しました");
          dm.element.setOpacity("0.5");
        });
    };

    const onClickDelete = (title: string) => {
      if (title !== "" && !confirm("この目的地を削除しますか？")) {
        return;
      }

      dm.dummyDelete();
      this.repo
        .delete(dm.destination.id)
        .then(() => filterMarkers(dm.destination.id))
        .catch((error) => {
          const message =
            error instanceof Error && error.message
              ? error.message
              : "目的地の削除に失敗しました";
          toast.error(message);
          dm.restoreFromDummyDelete();
        });
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
