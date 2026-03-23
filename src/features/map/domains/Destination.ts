interface LngLat {
  lng: number;
  lat: number;
}

export class Destination {
  constructor(
    public readonly id: number,
    public readonly lnglat: LngLat,
    public readonly title: string,
  ) {
    if (!title) throw new Error("titleは必須です");
    if (lnglat.lat < -90 || lnglat.lat > 90) throw new Error("緯度が不正です");
    if (lnglat.lng < -180 || lnglat.lng > 180)
      throw new Error("経度が不正です");
  }
}
