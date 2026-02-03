import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import { OfflineManagerControl } from "map-gl-offline";
// import "map-gl-offline/dist/style.css";
import { useMapStore } from "@/store/useMapStore";

const useMap = () => {
  const { setMap, setIsLoaded } = useMapStore();
  const mapContainer = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
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
            minzoom: 11,
            maxzoom: 20,
          },
        ],
      },
      center: [139.8800898, 35.6328464],
      zoom: 14,
      minZoom: 11,
      maxZoom: 22,
    });

    map.on("load", () => {
      setIsLoaded(true);
      const offlineControl = new OfflineManagerControl();

      // map.addControl(new maplibregl.NavigationControl());
    });
    setMap(map);

    return () => {
      map.remove();
    };
  }, []);

  return { mapContainer };
};

export default useMap;
