import type { Destination } from "@/features/map/domains/Destination";
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
}
