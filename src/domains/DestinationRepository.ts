import type { Destination } from "./Destination";

export interface DestinationRepository {
  save(destination: Destination): Promise<Destination>;
  findById(id: number): Promise<Destination | null>;
  findAll(): Promise<Destination[]>;
  delete(id: number): Promise<void>;
}
