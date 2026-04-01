import type { LngLat } from "@/features/map/domains/valueObjects/LngLat";
export type MapErrorType =
  | "fetch-failed-offline"
  | "fetch-failed-online"
  | "out-of-bounds";

export interface IMapAdapter {
  // 地図の初期化
  init(id: string, container: HTMLDivElement): void;

  onError(callback: (type: MapErrorType) => Promise<void> | void): void;
  onLoad(callback?: () => Promise<void> | void): void;

  onReady(callback: () => void): void;

  // 長押し時のコールバック登録
  onLongPress(callback: (lngLat: LngLat) => Promise<void> | void): void;

  // 地図の破棄
  destroy(callback?: () => Promise<void> | void): void;
}
