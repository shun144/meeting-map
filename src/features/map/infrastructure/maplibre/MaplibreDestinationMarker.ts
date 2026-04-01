import maplibregl from "maplibre-gl";
import { DestinationMarker } from "@/features/map/domains/DestinationMarker";
import styles from "./marker.module.css";
import type { IDestinationMarker } from "../../application/IDestinationMarker";

export class MaplibreDestinationMarker implements IDestinationMarker {
  private element: maplibregl.Marker;
  private inputElem: HTMLInputElement;
  private deleteButton: HTMLButtonElement;
  private abortController = new AbortController();

  create(
    dm: DestinationMarker,
    onUpdateTitle?: (title: string) => void,
    onDelete?: () => Promise<void>,
  ): MaplibreDestinationMarker {
    this.element = new maplibregl.Marker({
      color: "#4285F4",
      className: styles.marker,
    });

    this.element.setLngLat(dm.destination.lnglat);
    this.element
      .getElement()
      .setAttribute("data-destination-marker-id", String(dm.destination.id));

    this.element.getElement().style.cursor = "pointer";

    // ポップアップのコンテナを作成
    const popupContainer = document.createElement("div");
    popupContainer.className = styles.popupContainer;

    // インプットラッパー（削除ボタンを配置するため）
    const inputWrapper = document.createElement("div");
    inputWrapper.className = styles.inputWrapper;

    // インプット要素
    this.inputElem = document.createElement("input");
    this.inputElem.className = styles.popupInput;
    this.inputElem.defaultValue = dm.destination.title;
    this.inputElem.maxLength = 30;
    this.inputElem.addEventListener(
      "keydown",
      (event) => {
        if (event.key === "Enter") this.element.togglePopup();
      },
      { signal: this.abortController.signal },
    );

    this.inputElem.addEventListener(
      "change",
      (event) => {
        const title = (event.target as HTMLInputElement).value;
        if (onUpdateTitle) onUpdateTitle(title);
      },
      { signal: this.abortController.signal },
    );

    this.inputElem.addEventListener(
      "focusout",
      () => {
        this.element.togglePopup();
        setTimeout(() => {
          window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        }, 100);
      },
      { signal: this.abortController.signal },
    );

    // 削除ボタン
    this.deleteButton = document.createElement("button");
    this.deleteButton.className = styles.deleteButton;
    this.deleteButton.type = "button";
    this.deleteButton.setAttribute("aria-label", "削除");
    this.deleteButton.innerHTML = `
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
    <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
  </svg>
`;

    this.deleteButton.addEventListener(
      "click",
      async () => {
        if (!onDelete) {
          this.destroy();
          return;
        }

        try {
          this.optimisticDelete();
          await onDelete();
          this.destroy();
        } catch (error) {
          this.rollbackDelete();
        }
      },
      { signal: this.abortController.signal },
    );

    inputWrapper.appendChild(this.inputElem);
    inputWrapper.appendChild(this.deleteButton);
    popupContainer.appendChild(inputWrapper);

    const popupElem = new maplibregl.Popup({
      closeButton: false,
      className: styles.popup,
      focusAfterOpen: false,
    });

    popupElem.setDOMContent(popupContainer);
    this.element.setPopup(popupElem);

    return this;
  }

  optimisticDelete() {
    this.element.togglePopup();
    this.element.setOpacity("0");
    this.element.getElement().style.pointerEvents = "none";
  }

  rollbackDelete() {
    this.element.setOpacity("1");
    this.element.getElement().style.pointerEvents = "auto";
  }

  popup() {
    setTimeout(() => this.element.togglePopup(), 0);
  }

  destroy() {
    this.abortController.abort();
    this.element.remove();
  }
}
