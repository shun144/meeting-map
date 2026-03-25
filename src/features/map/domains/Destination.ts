interface LngLat {
  lng: number;
  lat: number;
}

export class Destination {
  public readonly title: string;

  constructor(
    public readonly id: number,
    public readonly lnglat: LngLat,
    title: string | null,
  ) {
    if (lnglat.lat < -90 || lnglat.lat > 90) throw new Error("緯度が不正です");
    if (lnglat.lng < -180 || lnglat.lng > 180)
      throw new Error("経度が不正です");

    this.title = title ?? "";
  }
}
