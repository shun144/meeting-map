import { Destination } from "@/features/map/domains/entities/Destination";
import type { LngLat } from "../valueObjects/LngLat";
export type DestinationMarkerStatus = "NEW" | "SAVED";

export class DestinationMarker {
  constructor(
    public destination: Destination,
    public status: DestinationMarkerStatus,
  ) {}

  save() {
    this.status = "SAVED";
  }

  isSave() {
    return this.status === "SAVED";
  }

  updateDestination(lngLat: LngLat, title: string) {
    this.destination = new Destination(this.destination.id, lngLat, title);
  }
}
