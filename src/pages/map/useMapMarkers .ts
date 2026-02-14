import React, { useCallback, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import styles from "./marker.module.css";
import type { DestinationRepository } from "@/repositories/DestinationRepository";
import { Destination } from "@/domains/Destination";

interface MarkerWithId {
  id: number;
  title: string;
  marker: maplibregl.Marker;
}

const useMapMarkers = (repo: DestinationRepository) => {
  const [markers, setMarkers] = useState<MarkerWithId[]>([]);
  const markerInputsRef = useRef<Map<number, HTMLInputElement>>(new Map());

  const addMarker = (
    map: maplibregl.Map | null,
    id: number,
    latlng: maplibregl.LngLatLike,
    title: string,
  ) => {
    if (!map) return;

    const markerElem = new maplibregl.Marker({
      color: "#4285F4",
      className: styles.marker,
    });
    markerElem.setLngLat(latlng);
    markerElem
      .getElement()
      .setAttribute("data-destination-marker-id", String(id));

    setMarkers((prev) => [...prev, { id, title, marker: markerElem }]);

    const inputElem = document.createElement("input");
    inputElem.className = styles.popupInput;
    inputElem.defaultValue = title;

    const popupElem = new maplibregl.Popup({
      closeButton: false,
    });

    inputElem.addEventListener("change", (event) => {
      const targetValue = (event.target as HTMLInputElement).value;
      const newData = {
        id,
        title: targetValue,
        marker: markerElem,
      };
      setMarkers((prev) => prev.map((x) => (x.id === id ? newData : x)));
      const data = new Destination(id, latlng, targetValue);
      repo.save(data);
    });

    markerInputsRef.current.set(id, inputElem);
    popupElem.setDOMContent(inputElem);
    markerElem.setPopup(popupElem);
    markerElem.addTo(map);

    return markerElem;
  };

  // TODO:削除失敗時の復元処理
  const removeMarker = (id: number) => {
    repo.delete(id);
    setMarkers((prev) => {
      const target = prev.find((x) => x.id === id);
      if (!target) return prev;
      target.marker.remove();
      return prev.filter((x) => x.id !== id);
    });
  };

  return { addMarker, removeMarker };
};

export default useMapMarkers;
