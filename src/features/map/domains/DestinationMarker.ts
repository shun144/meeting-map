import type { Destination } from "./Destination";
import maplibregl from "maplibre-gl";
import styles from "./marker.module.css";

export default class DestinationMarker {
  readonly element: maplibregl.Marker;

  constructor(
    public destination: Destination,
    public status: "NEW" | "SAVED",
    onChangeInput: (title: string) => void,
    onClickDelete: (title: string) => void,
  ) {
    this.element = new maplibregl.Marker({
      color: "#4285F4",
      className: styles.marker,
    });

    this.element.setLngLat(destination.latlng);
    this.element
      .getElement()
      .setAttribute("data-destination-marker-id", String(destination.id));

    this.element.getElement().style.cursor = "pointer";

    // ポップアップのコンテナを作成
    const popupContainer = document.createElement("div");
    popupContainer.className = styles.popupContainer;

    // インプットラッパー（削除ボタンを配置するため）
    const inputWrapper = document.createElement("div");
    inputWrapper.className = styles.inputWrapper;

    // インプット要素
    const inputElem = document.createElement("input");
    inputElem.className = styles.popupInput;
    inputElem.defaultValue = destination.title;
    inputElem.maxLength = 30;
    inputElem.onkeydown = (event) => {
      if (event.key === "Enter") this.element.togglePopup();
    };

    inputElem.addEventListener("change", (event) => {
      const title = (event.target as HTMLInputElement).value;
      onChangeInput(title);
    });

    inputElem.addEventListener("focusout", () => {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
      }, 100);
      this.element.togglePopup();
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

    deleteButton.addEventListener("click", () => {
      onClickDelete(inputElem.value);
    });

    inputWrapper.appendChild(inputElem);
    inputWrapper.appendChild(deleteButton);
    popupContainer.appendChild(inputWrapper);

    const popupElem = new maplibregl.Popup({
      closeButton: false,
      className: styles.popup,
      focusAfterOpen: false,
    });

    popupElem.setDOMContent(popupContainer);
    this.element.setPopup(popupElem);
  }

  dummyDelete() {
    this.element.togglePopup();
    this.element.setOpacity("0");
    this.element.getElement().style.pointerEvents = "none";
  }

  restoreFromDummyDelete() {
    this.element.setOpacity("1");
    this.element.getElement().style.pointerEvents = "auto";
  }
}
