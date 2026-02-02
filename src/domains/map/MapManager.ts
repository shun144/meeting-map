import maplibregl, { type MapOptions } from "maplibre-gl";

export class MapManager {
  map: maplibregl.Map | null = null;

  constructor() {}

  init(container: string | HTMLElement) {
    if (this.map) return;

    const mapOptions: MapOptions = {
      container,
      style: {
        version: 8,
        sources: {
          "base-map": {
            type: "raster",
            tiles: [
              "https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg",
            ],
            tileSize: 256,
            attribution:
              'Map tiles by <a target="_blank" href="https://stamen.com">Stamen Design</a>; Hosting by <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a>. Data &copy; <a href="https://www.openstreetmap.org/about" target="_blank">OpenStreetMap</a> contributors',
          },
        },
        layers: [
          {
            id: "base-tiles",
            type: "raster",
            source: "base-map",
            minzoom: 0,
            maxzoom: 22,
          },
        ],
      },
      center: [139.768, 35.6844],
      zoom: 14,
    };

    this.map = new maplibregl.Map(mapOptions);

    return this.map;
  }
}
