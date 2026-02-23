import { MapRepository } from "@/features/map/infrastructure/MapRepository";
import { memo, useEffect, useMemo, useState } from "react";
import CacheClearSection from "./CacheClearSection";
import Cards from "./Cards";
import HomeHeader from "./HomeHeader";
import Loading from "./Loading";
import NoData from "./NoData";

export interface MapDTO {
  id: string;
  name: string;
}

const Home = () => {
  const repo = useMemo(() => new MapRepository(), []);
  const [mapInfos, setMapInfos] = useState<MapDTO[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await repo.fetchAll();
        setMapInfos(data);
      } catch (error) {
        setMapInfos([]);
      } finally {
        setIsLoaded(true);
      }
    })();
  }, []);

  return (
    <div className="min-h-full bg-linear-to-br from-blue-50 to-indigo-100 py-6 sm:py-8 px-3 sm:px-4 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <HomeHeader />

        {isLoaded ? (
          <>
            {mapInfos.length > 0 ? (
              <Cards mapInfos={mapInfos} isClearing={isClearing} />
            ) : (
              <NoData />
            )}
          </>
        ) : (
          <Loading />
        )}

        <CacheClearSection
          isClearing={isClearing}
          setIsClearing={setIsClearing}
        />
      </div>
    </div>
  );
};

export default memo(Home);
