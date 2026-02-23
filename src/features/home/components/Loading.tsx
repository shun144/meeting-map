import { memo } from "react";

const Loading = () => {
  return (
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
  );
};

export default memo(Loading);
