import maplibregl from "maplibre-gl";

export class Destination {
  id: number;
  latlng: maplibregl.LngLatLike;
  #title: string;

  get title(): string {
    return this.#title ?? "";
  }

  constructor(id: number, latlng: maplibregl.LngLatLike, title: string) {
    this.id = id;
    this.latlng = latlng;
    this.#title = title;
  }
}
