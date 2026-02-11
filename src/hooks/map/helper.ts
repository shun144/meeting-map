import maplibregl from "maplibre-gl";
import { insertDestination } from "@/lib/supabase/supabaseFunction";
import type { Destination } from "@/domains/Destination";

export const setDestinationMarker = (
  lat: number,
  lng: number,
  map: maplibregl.Map,
  initialTitle?: string,
  id?: number,
) => {
  // マーカーコンテナを作成
  const markerContainer = document.createElement("div");
  if (id) {
    markerContainer.id = `destination-marker-${id}`;
  }

  // 内部ラッパー（吹き出しの配置用）
  const wrapper = document.createElement("div");
  wrapper.style.position = "relative";

  // ピン部分
  const pin = document.createElement("div");
  pin.innerHTML = `
      <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
        <g fill="none" fill-rule="evenodd">
          <path d="M12.5 0C5.596 0 0 5.596 0 12.5c0 1.25.19 2.457.534 3.598C2.842 24.154 12.5 41 12.5 41s9.658-16.846 11.966-24.902c.344-1.14.534-2.348.534-3.598C25 5.596 19.404 0 12.5 0z" fill="#EA4335"/>
          <circle fill="#FFF" cx="12.5" cy="12.5" r="7"/>
        </g>
      </svg>
    `;
  pin.style.cursor = "pointer";

  // 吹き出し要素を作成
  const popup = document.createElement("div");
  popup.style.position = "absolute";
  popup.style.bottom = "45px";
  popup.style.left = "50%";
  popup.style.transform = "translateX(-50%)";
  popup.style.zIndex = "1000";

  // 吹き出しの内容（白い箱）
  const popupContent = document.createElement("div");
  popupContent.style.background = "white";
  popupContent.style.borderRadius = "8px";
  popupContent.style.padding = "16px";
  popupContent.style.boxShadow = "0 2px 8px rgba(0,0,0,0.2)";
  popupContent.style.minWidth = "200px";
  popupContent.style.position = "relative";
  popupContent.style.marginBottom = "10px";

  // input要素を作成
  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "タイトルを入力";
  input.style.width = "100%";
  input.style.padding = "8px";
  input.style.border = "1px solid #ddd";
  input.style.borderRadius = "4px";
  input.style.fontSize = "14px";
  input.style.boxSizing = "border-box";
  input.defaultValue = initialTitle ?? "";

  // ピンのクリックイベント
  pin.addEventListener("click", (event) => {
    event.stopPropagation();
    const isVisible = popup.style.display === "block";
    popup.style.display = isVisible ? "none" : "block";

    // 表示した場合はフォーカスを当てる
    if (!isVisible) {
      setTimeout(() => input.focus(), 0);
    }
  });

  // ピンのダブルクリックイベントを止める
  pin.addEventListener("dblclick", (event) => {
    event.stopPropagation();
  });

  // クリック時に明示的にフォーカスを当てる
  input.addEventListener("mousedown", (event) => {
    event.stopPropagation(); // 地図へのイベント伝播を止める
    // 次のイベントループで確実にinputにフォーカスさせる
    setTimeout(() => input.focus(), 0);
  });

  input.addEventListener("blur", async () => {
    if (initialTitle === input.value) {
      return;
    }

    const args = {
      title: input.value,
      lat,
      lng,
    };

    try {
      await insertDestination(args);
    } catch (error) {}
  });

  // 三角形の吹き出し部分
  const arrow = document.createElement("div");
  arrow.style.position = "absolute";
  arrow.style.bottom = "-10px";
  arrow.style.left = "50%";
  arrow.style.transform = "translateX(-50%)";
  arrow.style.width = "0";
  arrow.style.height = "0";
  arrow.style.borderLeft = "10px solid transparent";
  arrow.style.borderRight = "10px solid transparent";
  arrow.style.borderTop = "10px solid white";
  arrow.style.filter = "drop-shadow(0 2px 1px rgba(0,0,0,0.1))";

  // 要素を組み立て
  popupContent.appendChild(input);
  popupContent.appendChild(arrow);
  popup.appendChild(popupContent);

  // クリックイベントの伝播を止める
  popup.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  // ダブルクリックイベントの伝播を止める
  popup.addEventListener("dblclick", (event) => {
    event.stopPropagation();
  });

  // ラッパーに要素を追加
  wrapper.appendChild(popup);
  wrapper.appendChild(pin);

  // マーカーコンテナにラッパーを追加
  markerContainer.appendChild(wrapper);

  // 地図のクリックイベントで吹き出しを非表示にする
  const hidePopupOnMapClick = () => {
    popup.style.display = "none";
  };

  map.on("click", hidePopupOnMapClick);

  const marker = new maplibregl.Marker({
    element: markerContainer,
    anchor: "bottom",
  })
    .setLngLat([lng, lat])
    .addTo(map);

  // マーカーが削除されたときにイベントリスナーもクリーンアップ
  marker.on("remove", () => {
    map.off("click", hidePopupOnMapClick);
  });
};
