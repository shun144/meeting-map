import type { SupabaseMapRepository } from "../infrastructure/SupabaseMapRepository";

export const mapLoader = async (
  repo: SupabaseMapRepository,
  mapId: string | undefined,
): Promise<void> => {
  if (!mapId) {
    throw new Response("Map Not Found", { status: 404 });
  }

  try {
    await repo.find(mapId);
  } catch (error) {
    throw new Response("Map Not Found", { status: 404 });
  }
};
