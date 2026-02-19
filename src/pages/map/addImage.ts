// const images = [{ src: "/src/assets/toilet.png", name: "toilet-icon" }];

const images: { [key: string]: string } = {
  "toilet-icon": "/src/assets/toilet.png",
  "fastfood-icon": "/src/assets/fastfood.png",
  "cafe-icon": "/src/assets/cafe.png",
  "restaurant-icon": "/src/assets/restaurant.png",
  "shop-icon": "/src/assets/shop.png",
};

export const addImages = (mapInstance: maplibregl.Map) => {
  for (const [name, src] of Object.entries(images)) {
    const img = new Image(32, 32);
    img.onload = () => mapInstance.addImage(name, img);
    img.src = src;
  }
};
