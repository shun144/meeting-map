import { memo } from "react";

const HomeHeader = () => {
  return (
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
      <p className="text-xs sm:text-sm text-gray-400 mt-2 px-4">
        オフラインで地図を利用するには、事前にオンライン環境で一度地図を表示しておく必要があります。
      </p>
    </div>
  );
};

export default memo(HomeHeader);
