import type { LngLat } from "@/features/map/domains/valueObjects/LngLat";
export type MapErrorType =
  | "fetch-failed-offline"
  | "fetch-failed-online"
  | "out-of-bounds";

export interface IMapAdapter {
  init(id: string, container: HTMLDivElement): void;
  onError(callback: (type: MapErrorType) => Promise<void> | void): void;
  onLoad(callback?: () => Promise<void> | void): void;
  onReady(callback: () => void): void;
  onLongPress(callback: (lngLat: LngLat) => Promise<void> | void): void;
  destroy(callback?: () => Promise<void> | void): void;
}
