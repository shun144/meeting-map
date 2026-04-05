import { LngLat } from "@/features/map/domains/valueObjects/LngLat";

export class Destination {
  constructor(
    public readonly id: number,
    public readonly lnglat: LngLat,
    public readonly title: string,
  ) {}
}
