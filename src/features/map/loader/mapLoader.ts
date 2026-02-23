import type { MapRepository } from "../infrastructure/MapRepository";

export const mapLoader = async (
  repo: MapRepository,
  mapId: string | undefined,
): Promise<void> => {
  const mapData = await repo.find(mapId);
  if (!mapData) {
    throw new Response("Not Found", { status: 404 });
  }
};
