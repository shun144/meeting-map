import { type MapRepository } from "@/features/map/domains/repositories/MapRepository";

export const mapLoader = async (
  repo: MapRepository,
  mapId: string | undefined,
): Promise<void> => {
  if (!mapId) {
    throw new Response("Map Not Found", { status: 404 });
  }

  let exists: boolean;
  try {
    exists = await repo.isExist(mapId);
  } catch {
    throw new Response("Internal Server Error", { status: 500 });
  }

  if (!exists) {
    throw new Response("Map Not Found", { status: 404 });
  }
};
