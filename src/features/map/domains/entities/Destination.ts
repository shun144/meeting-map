import { LngLat } from "@/features/map/domains/valueObjects/LngLat";

export type PersistenceStatus = "NEW" | "SAVED";

export class Destination {
  constructor(
    public id: number,
    public lnglat: LngLat,
    public title: string,
    public persistenceStatus: PersistenceStatus = "NEW",
  ) {}

  save() {
    this.persistenceStatus = "SAVED";
  }

  isSave() {
    return this.persistenceStatus === "SAVED";
  }

  update(title: string) {
    return new Destination(this.id, this.lnglat, title, this.persistenceStatus);
  }
}
