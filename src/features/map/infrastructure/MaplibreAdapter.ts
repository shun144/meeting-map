import maplibregl from "maplibre-gl";
import type {
  IMapAdapter,
  MapErrorType,
} from "@/features/map/application/IMapAdapter";
import { LngLat } from "@/features/map/domains/valueObjects/LngLat";
import { createMap } from "@/features/map/utils/map";

export class MaplibreAdapter implements IMapAdapter {
  private map: maplibregl.Map | null = null;

  init(id: string, container: HTMLDivElement) {
    this.map = createMap(id, container);
  }

  onError(callback: (type: MapErrorType) => void) {
    this.map?.on("error", (event) => {
      if (event.error.message !== "Failed to fetch") return;
      navigator.onLine
        ? callback("fetch-failed-online")
        : callback("fetch-failed-offline");
    });
  }

  getMap() {
    return this.map!;
  }

  // onLongPress(callback: (lngLat: LngLat) => void) {
  //   this.map?.on("touchend", (e) => {
  //     const { lng, lat } = e.lngLat;
  //     callback(new LngLat(lng, lat));
  //   });
  // }

  // destroy() {
  //   this.map?.remove();
  // }
}
