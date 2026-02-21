import maplibregl from "maplibre-gl";
import { PMTiles, Protocol } from "pmtiles";
import { mapStyles } from "@/config/mapStyle";

export const createMap = (mapId: string, mapContainerDiv: HTMLDivElement) => {
  const { src, style, center, zoom, maxZoom, minZoom, sw, ne } =
    getMapStyle(mapId);

  const protocol = new Protocol();
  maplibregl.addProtocol("pmtiles", protocol.tile);
  const pmtiles = new PMTiles(src);

  const maxBounds = sw && ne ? new maplibregl.LngLatBounds(sw, ne) : undefined;

  protocol.add(pmtiles);
  const maplibreglMap = new maplibregl.Map({
    container: mapContainerDiv,
    center,
    zoom,
    maxZoom,
    minZoom,
    maxBounds,
    style,
    doubleClickZoom: false,
  });

  maplibreglMap.getCanvas().style.cursor = "pointer";
  return maplibreglMap;
};

const getMapStyle = (mapId: string) => {
  return mapStyles[mapId];
};

import toiletIcon from "@/assets/toilet.png";
import fastfoodIcon from "@/assets/fastfood.png";
import cafeIcon from "@/assets/cafe.png";
import restaurantIcon from "@/assets/restaurant.png";
import shopIcon from "@/assets/shop.png";

const images: { [key: string]: string } = {
  "toilet-icon": toiletIcon,
  "fastfood-icon": fastfoodIcon,
  "cafe-icon": cafeIcon,
  "restaurant-icon": restaurantIcon,
  "shop-icon": shopIcon,
};

export const addImages = (mapInstance: maplibregl.Map) => {
  for (const [name, src] of Object.entries(images)) {
    if (mapInstance.hasImage(name)) continue;
    const img = new Image(32, 32);
    img.onload = () => {
      if (mapInstance.hasImage(name)) return;
      mapInstance.addImage(name, img);
    };
    img.src = src;
  }
};
