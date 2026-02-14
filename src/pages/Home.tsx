import React, { memo } from "react";
import { NavLink } from "react-router";

const Home = () => {
  return (
    <div className="min-h-full bg-linear-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg mb-4 sm:mb-6">
            <svg
              className="w-8 h-8 sm:w-10 sm:h-10 text-white"
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
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
            地図テンプレートを選択してください
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            待ち合わせに使用する地図を選んでください
          </p>
        </div>

        {/* カードリスト */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <NavLink
            to="/map/e7d98183-5ebe-4171-a364-2eb93cc6de97"
            className={({ isActive }) =>
              `group block p-6 sm:p-8 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border-2 ${
                isActive
                  ? "border-blue-500 ring-4 ring-blue-100"
                  : "border-transparent hover:border-blue-200"
              }`
            }
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-linear-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-6 h-6 sm:w-7 sm:h-7 text-white"
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
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                  地図1
                </h2>
                <p className="text-xs sm:text-sm text-gray-500">
                  標準テンプレート
                </p>
              </div>
            </div>
            <p className="text-sm sm:text-base text-gray-600">
              シンプルで使いやすい基本的な地図テンプレートです
            </p>
            <div className="mt-4 flex items-center text-blue-600 font-medium text-sm sm:text-base">
              選択する
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 ml-1 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </NavLink>

          <NavLink
            to="/messages2"
            className={({ isActive }) =>
              `group block p-6 sm:p-8 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border-2 ${
                isActive
                  ? "border-blue-500 ring-4 ring-blue-100"
                  : "border-transparent hover:border-blue-200"
              }`
            }
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-linear-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-6 h-6 sm:w-7 sm:h-7 text-white"
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
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
                  地図2
                </h2>
                <p className="text-xs sm:text-sm text-gray-500">
                  詳細テンプレート
                </p>
              </div>
            </div>
            <p className="text-sm sm:text-base text-gray-600">
              詳細な情報を含む高機能な地図テンプレートです
            </p>
            <div className="mt-4 flex items-center text-indigo-600 font-medium text-sm sm:text-base">
              選択する
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 ml-1 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default memo(Home);
