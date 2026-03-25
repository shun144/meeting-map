import { Map } from "@/features/map/domains/Map";

export interface MapRepository {
  isExist: (id: string) => Promise<boolean>;
  findAll: () => Promise<Map[]>;
}
