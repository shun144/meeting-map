import type { LngLat } from "@/features/map/domains/valueObjects/LngLat";

export type MapErrorType = "fetch-failed-offline" | "fetch-failed-online";

export interface IMapAdapter {
  // 地図の初期化
  init(id: string, container: HTMLDivElement): void;

  // // トラッキング開始
  // startTracking(): void;

  // // トラッキング終了
  // stopTracking(): void;

  // // 長押し時のコールバック登録
  // onLongPress(callback: (lngLat: LngLat) => void): void;

  // // 地図の破棄
  // destroy(): void;
}
