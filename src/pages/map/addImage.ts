import toiletIcon from "/src/assets/toilet.png";
import fastfoodIcon from "/src/assets/fastfood.png";
import cafeIcon from "/src/assets/cafe.png";
import restaurantIcon from "/src/assets/restaurant.png";
import shopIcon from "/src/assets/shop.png";

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
