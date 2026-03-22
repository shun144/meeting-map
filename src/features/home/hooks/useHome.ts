import { SupabaseMapRepository } from "@/features/map/infrastructure/SupabaseMapRepository";
import { useEffect, useMemo, useState } from "react";
import type { Map } from "@/features/map/domains/Map";

export const useHome = () => {
  const repo = useMemo(() => new SupabaseMapRepository(), []);
  const [mapList, setMapList] = useState<Map[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await repo.findAll();
        setMapList(data);
      } catch (error) {
        setMapList([]);
      } finally {
        setIsLoaded(true);
      }
    })();
  }, []);

  return { isLoaded, mapList, isClearing, setIsClearing };
};
