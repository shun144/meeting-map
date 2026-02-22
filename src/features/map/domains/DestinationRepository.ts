import type { Destination } from "./Destination";

export interface DestinationRepository {
  // save(destination: Destination): Promise<void>;
  add(destination: Destination): Promise<void>;
  update(destination: Destination): Promise<void>;
  findAll(): Promise<Destination[]>;
  delete(id: number): Promise<void>;
}
