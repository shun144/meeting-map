import { Map } from "@/features/map/domains/Map";

export interface MapRepository {
  find: (id: string) => Promise<Map>;
  findAll: () => Promise<Map[]>;
}
