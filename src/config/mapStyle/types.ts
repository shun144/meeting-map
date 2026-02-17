import maplibregl from "maplibre-gl";

export interface MapSrcStyle {
  src: string;
  style: maplibregl.StyleSpecification;
  center: maplibregl.LngLatLike;
  zoom: number;
  maxZoom: number;
  minZoom: number;
}
