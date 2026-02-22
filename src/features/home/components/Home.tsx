import React, { memo, useEffect, useMemo, useState } from "react";
import { MapRepository } from "@/features/map/infrastructure/MapRepository";
import { NavLink } from "react-router";
import { clearCache } from "@/lib/indexedDB/database";

interface MapDTO {
  id: string;
  name: string;
}

const Home = () => {
  const repo = useMemo(() => new MapRepository(), []);
  const [mapInfos, setMapInfos] = useState<MapDTO[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [clearSuccess, setClearSuccess] = useState(false);

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

  const handleClearCache = async () => {
    if (!confirm("キャッシュをクリアしますか？")) return;

    setIsClearing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await clearCache();

      setClearSuccess(true);
      setTimeout(() => setClearSuccess(false), 3000);
    } catch (error) {
      console.error("キャッシュクリアに失敗しました", error);
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="min-h-full bg-linear-to-br from-blue-50 to-indigo-100 py-6 sm:py-8 px-3 sm:px-4 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6 sm:mb-8 lg:mb-12">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg mb-3 sm:mb-4 lg:mb-6">
            <svg
              className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-800 mb-1 sm:mb-2 px-2">
            地図を選択してください
          </h1>
        </div>

        {/* カードリスト */}
        {isLoaded ? (
          <>
            {mapInfos.length > 0 ? (
              <div
                className={`grid gap-3 sm:gap-4 lg:gap-6 ${mapInfos.length === 1 ? "grid-cols-1 max-w-md mx-auto" : "grid-cols-1 sm:grid-cols-2"}`}
              >
                {mapInfos.map((mapInfo) => (
                  <NavLink
                    key={mapInfo.id}
                    to={`/map/${mapInfo.id}`}
                    className={({ isActive }) =>
                      `group block p-4 sm:p-6 lg:p-8 bg-white rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border-2 ${
                        isActive
                          ? "border-blue-500 ring-2 sm:ring-4 ring-blue-100"
                          : "border-transparent hover:border-blue-200"
                      } ${isClearing ? "cursor-not-allowed opacity-50" : ""}`
                    }
                  >
                    <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-linear-to-br from-blue-500 to-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <svg
                          className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                          />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors truncate">
                          {mapInfo.name}
                        </h2>
                      </div>
                    </div>
                  </NavLink>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 sm:py-16 px-4">
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full mb-4 sm:mb-6">
                  <svg
                    className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-2 px-4">
                  地図がありません
                </h3>
                <p className="text-xs sm:text-sm lg:text-base text-gray-600 max-w-md mx-auto px-4">
                  現在利用可能な地図がありません。
                  <br className="hidden sm:inline" />
                  しばらく経ってから再度お試しください。
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 sm:py-16 px-4">
            <div className="inline-flex items-center justify-center mb-4 sm:mb-6">
              <div className="relative">
                <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-200 rounded-full"></div>
                <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-600 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
              </div>
            </div>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-2">
              読み込み中...
            </h3>
            <p className="text-xs sm:text-sm lg:text-base text-gray-600">
              地図を取得しています
            </p>
          </div>
        )}

        {/* キャッシュクリア */}
        <div className="mt-10 sm:mt-14 border-t border-indigo-100 pt-6 sm:pt-8 flex flex-col items-center gap-3">
          <p className="text-xs sm:text-sm text-gray-400 text-center">
            キャッシュした地図データをクリアする
            <br className="sm:hidden" />
            場合はこちらをクリック
          </p>
          <button
            onClick={handleClearCache}
            disabled={isClearing}
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg border border-red-200 text-red-500 text-xs sm:text-sm font-medium hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isClearing ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" />
                クリア中...
              </>
            ) : (
              <>
                <svg
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                キャッシュクリア
              </>
            )}
          </button>

          {clearSuccess && (
            <p className="text-xs text-green-500 flex items-center gap-1">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              キャッシュをクリアしました
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(Home);
