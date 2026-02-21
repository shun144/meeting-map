import { Destination } from "@/features/map/domains/Destination";
import { type DestinationRepository } from "@/features/map/domains/DestinationRepository";
import maplibregl from "maplibre-gl";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import styles from "./marker.module.css";

interface MarkerWithId {
  id: number;
  title: string;
  marker: maplibregl.Marker;
}

const useDestinationMarkerManager = (repo: DestinationRepository) => {
  const [markers, setMarkers] = useState<MarkerWithId[]>([]);

  const createMarker = useCallback(
    (
      map: maplibregl.Map | null,
      id: number,
      latlng: maplibregl.LngLatLike,
      title: string,
    ) => {
      if (!map) return;

      const marker = new maplibregl.Marker({
        color: "#4285F4",
        className: styles.marker,
      });
      marker.setLngLat(latlng);
      marker
        .getElement()
        .setAttribute("data-destination-marker-id", String(id));

      setMarkers((prev) => [...prev, { id, title, marker: marker }]);

      // ポップアップのコンテナを作成
      const popupContainer = document.createElement("div");
      popupContainer.className = styles.popupContainer;

      // インプットラッパー（削除ボタンを配置するため）
      const inputWrapper = document.createElement("div");
      inputWrapper.className = styles.inputWrapper;

      // インプット要素
      const inputElem = document.createElement("input");
      inputElem.className = styles.popupInput;
      inputElem.defaultValue = title;
      inputElem.maxLength = 30;
      inputElem.onkeydown = (event) => {
        if (event.key === "Enter") marker.togglePopup();
      };

      inputElem.addEventListener("change", (event) => {
        const newTitle = (event.target as HTMLInputElement).value;

        const newMarkerData = {
          id,
          title: newTitle,
          marker: marker,
        };
        setMarkers((prev) =>
          prev.map((x) => (x.id === id ? newMarkerData : x)),
        );
        const newDestination = new Destination(id, latlng, newTitle);
        repo
          .save(newDestination)
          .catch(() => toast.error("目的地の保存に失敗しました"));
      });

      // 削除ボタン
      const deleteButton = document.createElement("button");
      deleteButton.className = styles.deleteButton;
      deleteButton.type = "button";
      deleteButton.setAttribute("aria-label", "削除");
      deleteButton.innerHTML = `
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
    <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
  </svg>
`;

      // 削除ボタンのクリックイベント
      deleteButton.addEventListener("click", () => {
        if (inputElem.value !== "" && !confirm("この目的地を削除しますか？")) {
          return;
        }
        popupElem.remove();
        marker.remove();
        setMarkers((prev) => prev.filter((x) => x.id !== id));
        repo.delete(id);
      });

      inputWrapper.appendChild(inputElem);
      inputWrapper.appendChild(deleteButton);
      popupContainer.appendChild(inputWrapper);

      const popupElem = new maplibregl.Popup({
        closeButton: false,
      });

      popupElem.setDOMContent(popupContainer);
      marker.setPopup(popupElem);
      marker.addTo(map);

      return marker;
    },
    [repo],
  );

  const cleanup = () => {
    setMarkers((prev) => {
      prev.forEach((x) => x.marker.remove());
      return [];
    });
  };

  return { markers, createMarker, cleanup };
};

export default useDestinationMarkerManager;
