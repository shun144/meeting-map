import { Destination } from "@/domains/Destination";
import maplibregl from "maplibre-gl";
import styles from "./marker.module.css";

export class DestinationMarker {
  get markerElem() {
    return this._markerElem;
  }

  getId() {
    return this._destination.id;
  }

  getLatlng() {
    return this._destination.latlng;
  }

  remove() {
    this._markerElem.remove();
  }

  constructor(
    private _destination: Destination,
    private _markerElem: maplibregl.Marker,
  ) {}
}

// import { Destination } from "@/domains/Destination";
// import maplibregl from "maplibre-gl";
// import styles from "./marker.module.css";

// export class DestinationMarker {
//   #destination: Destination;
//   dom: maplibregl.Marker;
//   popup: maplibregl.Popup;
//   #inputElem: HTMLInputElement;
//   #boundClosePopup: () => void;

//   constructor(destination: Destination,) {
//     this.#destination = destination;
//     this.#boundClosePopup = this.closePopup.bind(this);

//     this.dom = new maplibregl.Marker({
//       color: destination.id === 0 ? "red" : "#4285F4",
//       className: styles.marker,
//     });

//     this.dom
//       .getElement()
//       .setAttribute("data-destination-id", String(destination.id));
//     this.dom.setLngLat(destination.latlng);

//     this.#inputElem = document.createElement("input");
//     this.#inputElem.className = styles.popupInput;
//     this.#inputElem.defaultValue = destination.title;

//     this.popup = new maplibregl.Popup({
//       closeButton: true,
//     });
//     this.popup.setDOMContent(this.#inputElem);

//     this.popup.on("close", this.#boundClosePopup);

//     this.dom.setPopup(this.popup);
//   }

//   closePopup() {
//     if (this.#destination.id === 0 && this.#inputElem.value === "") {
//       this.cleanup();
//     }

//     if (this.#inputElem.value === this.#destination.title) return;
//   }

//   remove() {
//     this.dom.remove();
//   }

//   cleanup() {
//     this.popup.off("close", this.#boundClosePopup);
//     this.dom.remove();
//   }
// }
