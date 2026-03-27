export class LngLat {
  readonly lng: number;
  readonly lat: number;

  constructor(lng: number, lat: number) {
    if (lng < -180 || lng > 180) throw new Error("経度が不正です");
    if (lat < -90 || lat > 90) throw new Error("緯度が不正です");

    this.lng = lng;
    this.lat = lat;
  }

  equal(other: LngLat) {
    return this.lng === other.lng && this.lat === other.lat;
  }
}
