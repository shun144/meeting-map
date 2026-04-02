import { Map } from "@/features/map/domains/entities/Map";

export interface MapRepository {
  isExist: (id: string) => Promise<boolean>;
  findAll: () => Promise<Map[]>;
}
