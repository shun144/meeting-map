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
    const img = new Image(32, 32);
    img.onload = () => mapInstance.addImage(name, img);
    img.src = src;
  }
};
