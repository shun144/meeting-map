import type { LngLat } from "@/features/map/domains/valueObjects/LngLat";
export type MapErrorType =
  | "fetch-failed-offline"
  | "fetch-failed-online"
  | "out-of-bounds";

export interface IMapAdapter {
  init(container: HTMLDivElement): void;
  onError(callback: (type: MapErrorType) => Promise<void> | void): void;
  onReady(callback: () => void): void;
  destroy(callback?: () => Promise<void> | void): void;
}
