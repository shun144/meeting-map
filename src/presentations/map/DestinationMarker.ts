import { Destination } from "@/domains/Destination";
import maplibregl from "maplibre-gl";

export class DestinationMarker {
  get markerElem() {
    return this._markerElem;
  }

  getId() {
    return this._destination.id;
  }

  getLatlng() {
    return this._destination.latlng;
  }

  remove() {
    this._markerElem.remove();
  }

  constructor(
    private _destination: Destination,
    private _markerElem: maplibregl.Marker,
  ) {}
}
