import maplibregl from "maplibre-gl";
import { Destination } from "@/domains/Destination";
import styles from "./marker.module.css";
import { DestinationRepository } from "@/repositories/DestinationRepository";

interface Args {
  destination: Destination;
  setDestinations: React.Dispatch<React.SetStateAction<Destination[]>>;
}

export const createDestinationMarker = ({
  destination,
  setDestinations,
}: Args) => {
  const div = document.createElement("div");
  const marker = new maplibregl.Marker({
    color: destination.id === 0 ? "red" : "#4285F4",
    className: styles.marker,
  });
  marker
    .getElement()
    .setAttribute("data-destination-id", String(destination.id));
  marker.setLngLat(destination.latlng);

  const inputElem = document.createElement("input");
  inputElem.className = styles.popupInput;
  inputElem.defaultValue = destination.title;

  const popup = new maplibregl.Popup({
    closeButton: true,
  });
  popup.setDOMContent(inputElem);

  marker.setPopup(popup);

  const handleClose = async () => {
    if (destination.id === 0 && inputElem.value === "") {
      marker.remove();
    }

    if (inputElem.value === destination.title) return;
    const newDestination = new Destination(
      destination.id,
      destination.latlng,
      inputElem.value,
    );
    const repo = new DestinationRepository();
    const savedDestination = await repo.save(newDestination);

    if (destination.id === 0) {
      setDestinations((prev) => [...prev, savedDestination]);
    } else {
      setDestinations((prev) =>
        prev.map((x) => {
          if (x.id === destination.id) {
            return new Destination(
              destination.id,
              destination.latlng,
              inputElem.value,
            );
          }
          return x;
        }),
      );
    }
  };

  popup.on("close", () => {
    handleClose();
  });

  const cleanup = () => {
    popup.off("close", handleClose);
    marker.remove();
  };

  return { marker, cleanup };
};
