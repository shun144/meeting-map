import React, { memo } from "react";

const NoData = () => {
  return (
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
  );
};

export default memo(NoData);
