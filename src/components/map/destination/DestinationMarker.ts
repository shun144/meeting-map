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

    const tempId = destination.id === 0 ? Date.now() : destination.id;
    const newDestination = new Destination(
      tempId,
      destination.latlng,
      inputElem.value,
    );

    if (destination.id === 0) {
      setDestinations((prev) => [...prev, newDestination]);
    } else {
      setDestinations((prev) =>
        prev.map((x) => (x.id === destination.id ? newDestination : x)),
      );
    }

    const repo = new DestinationRepository();

    repo
      .save(newDestination)
      .then((savedDestination) => {
        setDestinations((prev) =>
          prev.map((x) => (x.id === tempId ? savedDestination : x)),
        );
      })
      .catch((error) => {
        setDestinations((prev) => prev.filter((x) => x.id !== tempId));
      });
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
