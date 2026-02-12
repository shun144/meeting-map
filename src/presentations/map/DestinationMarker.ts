import { Destination } from "@/domains/Destination";
import maplibregl from "maplibre-gl";
import styles from "./marker.module.css";
import type { DestinationRepository } from "@/repositories/DestinationRepository";

export class DestinationMarker {
  #destination: Destination;
  dom: maplibregl.Marker;
  popup: maplibregl.Popup;
  #inputElem: HTMLInputElement;
  #boundClosePopup: () => void;

  #setDestinationMarkers: (
    value: React.SetStateAction<DestinationMarker[]>,
  ) => void;
  #repo: DestinationRepository;

  constructor(
    destination: Destination,
    setDestinationMarkers: (
      value: React.SetStateAction<DestinationMarker[]>,
    ) => void,
    repo: DestinationRepository,
  ) {
    this.#destination = destination;
    this.#boundClosePopup = this.closePopup.bind(this);
    this.#setDestinationMarkers = setDestinationMarkers;
    this.#repo = repo;

    this.dom = new maplibregl.Marker({
      color: destination.id === 0 ? "red" : "#4285F4",
      className: styles.marker,
    });

    this.dom
      .getElement()
      .setAttribute("data-destination-id", String(destination.id));
    this.dom.setLngLat(destination.latlng);

    this.#inputElem = document.createElement("input");
    this.#inputElem.className = styles.popupInput;
    this.#inputElem.defaultValue = destination.title;

    this.popup = new maplibregl.Popup({
      closeButton: true,
    });
    this.popup.setDOMContent(this.#inputElem);

    this.popup.on("close", this.#boundClosePopup);

    this.dom.setPopup(this.popup);
  }

  closePopup() {
    if (this.#destination.id === 0 && this.#inputElem.value === "") {
      this.cleanup();
    }

    if (this.#inputElem.value === this.#destination.title) return;

    const tempId =
      this.#destination.id === 0 ? Date.now() : this.#destination.id;
    const newDestination = new Destination(
      tempId,
      this.#destination.latlng,
      this.#inputElem.value,
    );

    if (this.#destination.id === 0) {
      this.#setDestinationMarkers((prev) => [...prev, newDestination]);
    } else {
      this.#setDestinationMarkers((prev) =>
        prev.map((x) => (x.id === this.#destination.id ? newDestination : x)),
      );
    }

    this.#repo
      .save(newDestination)
      .then((savedDestination) => {
        this.#setDestinationMarkers((prev) =>
          prev.map((x) => (x.id === tempId ? savedDestination : x)),
        );
      })
      .catch((error) => {
        this.#setDestinationMarkers((prev) =>
          prev.filter((x) => x.id !== tempId),
        );
      });
  }

  remove() {
    this.dom.remove();
  }

  cleanup() {
    this.popup.off("close", this.#boundClosePopup);
    this.dom.remove();
  }
}
