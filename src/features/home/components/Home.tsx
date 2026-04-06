import { useHome } from "@/features/home/hooks/useHome";
import { memo } from "react";
import CacheClearSection from "./CacheClearSection";
import Cards from "./Cards";
import HomeHeader from "./HomeHeader";
import HomeLoading from "./HomeLoading";
import NoData from "./NoData";

const Home = () => {
  const { isLoaded, mapList, isClearing, setIsClearing } = useHome();

  return (
    <div className="min-h-full bg-linear-to-br from-blue-50 to-indigo-100 py-6 sm:py-8 px-3 sm:px-4 lg:px-8 pb-[calc(1.5rem+env(safe-area-inset-bottom))] sm:pb-[calc(2rem+env(safe-area-inset-bottom))]">
      <div className="max-w-4xl mx-auto">
        <HomeHeader />

        {isLoaded ? (
          <>
            {mapList.length > 0 ? (
              <Cards mapList={mapList} isClearing={isClearing} />
            ) : (
              <NoData />
            )}
          </>
        ) : (
          <HomeLoading />
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
