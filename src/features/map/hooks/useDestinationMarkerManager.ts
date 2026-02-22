import { useCallback } from "react";
import { Destination } from "@/features/map/domains/Destination";
import type { DestinationRepository } from "@/features/map/domains/DestinationRepository";
import { useMapStore } from "@/store/useMapStore";
import { toast } from "react-toastify";
import DestinationMarker from "../domains/DestinationMarker";

const useDestinationMarkerManager = (repo: DestinationRepository) => {
  const createDestinationMarker = useCallback(
    (destination: Destination, status: "NEW" | "SAVED") => {
      const { markers, addMarkers, updateMarkers, filterMarkers } =
        useMapStore.getState();

      const onChangeInput = (title: string) => {
        dm.destination = new Destination(
          dm.destination.id,
          dm.destination.latlng,
          title,
        );

        if (dm.status === "NEW") {
          addMarkers(dm);
          repo
            .add(dm.destination)
            .then(() => {
              dm.status = "SAVED";
            })
            .catch((error) => {
              const message =
                error instanceof Error
                  ? error.message
                  : "目的地の保存に失敗しました";
              toast.error(message);
              dm.element.setOpacity("0.5");
            });
          return;
        }

        repo
          .update(dm.destination)
          .then(() => updateMarkers(dm))
          .catch((error) => {
            const message =
              error instanceof Error
                ? error.message
                : "目的地の更新に失敗しました";
            toast.error(message);
            dm.element.setOpacity("0.5");
          });
      };

      const onClickDelete = (title: string) => {
        if (title !== "" && !confirm("この目的地を削除しますか？")) {
          return;
        }

        dm.dummyDelete();
        repo
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
    },
    [repo],
  );

  return { createDestinationMarker };
};

export default useDestinationMarkerManager;
