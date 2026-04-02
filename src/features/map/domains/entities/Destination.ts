import { LngLat } from "@/features/map/domains/valueObjects/LngLat";

export class Destination {
  public readonly title: string;

  constructor(
    public readonly id: number,
    public readonly lnglat: LngLat,
    title: string | null,
  ) {
    this.title = title ?? "";
  }
}
