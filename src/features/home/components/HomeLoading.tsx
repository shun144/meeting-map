import { memo } from "react";

const HomeLoading = () => {
  return (
    <div className="text-center py-12 sm:py-16 px-4">
      <div className="inline-flex items-center justify-center mb-4 sm:mb-6">
        <div className="relative">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-100 rounded-full"></div>
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-transparent border-t-blue-500 border-r-indigo-500 rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
      </div>
      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 mb-2 tracking-wide">
        読み込み中...
      </h3>
      <p className="text-xs sm:text-sm text-blue-300 tracking-widest uppercase">
        地図を取得しています
      </p>
    </div>
  );
};

export default memo(HomeLoading);
