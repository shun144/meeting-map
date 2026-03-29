import type { Destination } from "../domains/Destination";
import styles from "./marker.module.css";
export type DestinationMarkerStatus = "NEW" | "SAVED";

export class DestinationMarker {
  constructor(
    public destination: Destination,
    public status: DestinationMarkerStatus,
  ) {}
}
