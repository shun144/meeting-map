import type { Destination } from "@/domains/Destination";
import maplibregl from "maplibre-gl";
import styles from "./marker.module.css";

interface Args {
  destination: Destination;
  onTitleChange: (
    id: number,
    latlng: maplibregl.LngLatLike,
    newTitle: string,
    markerElem: maplibregl.Marker,
  ) => void;
  isNew?: boolean;
}

export const createDestinationMarkerElem = ({
  destination,
  onTitleChange,
  isNew = false,
}: Args): maplibregl.Marker => {
  // const isNew = destination.id === 0;
  // const markerId = isNew ? Date.now() : destination.id;

  const markerElem = new maplibregl.Marker({
    // color: isNew ? "red" : "#4285F4",
    color: "#4285F4",
    className: styles.marker,
  });

  // markerElem.getElement().setAttribute("data-destination-id", String(markerId));
  markerElem.setLngLat(destination.latlng);

  const inputElem = document.createElement("input");
  inputElem.className = styles.popupInput;
  inputElem.defaultValue = destination.title;

  const onInputChange = (event: Event) => {
    const newTitle = (event.target as HTMLInputElement).value;
    onTitleChange(destination.id, destination.latlng, newTitle, markerElem);
  };

  inputElem.addEventListener("change", onInputChange);

  const popupElem = new maplibregl.Popup({
    closeButton: false,
  });

  popupElem.setDOMContent(inputElem);

  const onPopupClose = () => {
    if (isNew && inputElem.value === "") markerElem.remove();
  };

  popupElem.on("close", onPopupClose);

  markerElem.setPopup(popupElem);

  return markerElem;
};

// export const createNewDestinationMarkerElem = (
//   newDestination: Omit<Destination, "id">,
// ): maplibregl.Marker => {
//   const markerElem = new maplibregl.Marker({
//     color: "red",
//     className: styles.marker,
//   });

//   const tempId = Date.now();
//   markerElem.getElement().setAttribute("data-destination-id", String(tempId));
//   markerElem.setLngLat(newDestination.latlng);

//   const inputElem = document.createElement("input");
//   inputElem.className = styles.popupInput;
//   inputElem.defaultValue = newDestination.title;

//   const onChangeInput = (event: Event) => {
//     const targetValue = (event.target as HTMLInputElement).value;
//   };

//   inputElem.addEventListener("change", onChangeInput);

//   const popupElem = new maplibregl.Popup({
//     closeButton: true,
//   });
//   popupElem.setDOMContent(inputElem);

//   // popupElem.on("close", () => {
//   //   console.log("popup close");
//   // });

//   markerElem.setPopup(popupElem);

//   return markerElem;
// };

// export const createDestinationMarkerElem = (
//   destination: Destination,
// ): maplibregl.Marker => {
//   const markerElem = new maplibregl.Marker({
//     color: "#4285F4",
//     className: styles.marker,
//   });

//   markerElem
//     .getElement()
//     .setAttribute("data-destination-id", String(destination.id));
//   markerElem.setLngLat(destination.latlng);

//   const inputElem = document.createElement("input");
//   inputElem.className = styles.popupInput;
//   inputElem.defaultValue = destination.title;

//   const onChangeInput = (event: Event) => {
//     const targetValue = (event.target as HTMLInputElement).value;
//   };

//   inputElem.addEventListener("change", onChangeInput);

//   const popupElem = new maplibregl.Popup({
//     closeButton: true,
//   });
//   popupElem.setDOMContent(inputElem);

//   // popupElem.on("close", () => {
//   //   console.log("popup close");
//   // });

//   markerElem.setPopup(popupElem);

//   return markerElem;
// };
