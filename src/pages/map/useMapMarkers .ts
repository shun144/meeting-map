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

  const createMarker = (
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

    // 削除ボタン（ゴミ箱アイコン）
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
      if (!confirm("この目的地を削除しますか？")) {
        return;
      }

      // ポップアップを閉じる
      popupElem.remove();

      // マーカーを地図から削除
      markerElem.remove();

      // state から削除
      setMarkers((prev) => prev.filter((x) => x.id !== id));

      // リポジトリから削除
      repo.delete(id);

      // inputElem の参照を削除
      markerInputsRef.current.delete(id);
    });

    // コンテナに要素を追加
    inputWrapper.appendChild(inputElem);
    inputWrapper.appendChild(deleteButton);
    popupContainer.appendChild(inputWrapper);

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
    popupElem.setDOMContent(popupContainer);
    markerElem.setPopup(popupElem);
    markerElem.addTo(map);

    return markerElem;
  };

  const removeMarker = (id: number) => {
    repo.delete(id);
    setMarkers((prev) => {
      const target = prev.find((x) => x.id === id);
      if (!target) return prev;
      target.marker.remove();
      return prev.filter((x) => x.id !== id);
    });
  };

  return { createMarker, removeMarker };
};

export default useMapMarkers;
