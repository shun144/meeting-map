import maplibregl from "maplibre-gl";

export class Destination {
  id: number;
  #latlng: maplibregl.LngLatLike;
  #title: string | null;

  get latlng() {
    return this.#latlng;
  }

  get title(): string {
    return this.#title ?? "";
  }

  constructor(id: number, latlng: maplibregl.LngLatLike, title: string | null) {
    this.id = id;
    this.#latlng = latlng;
    this.#title = title;
  }

}
