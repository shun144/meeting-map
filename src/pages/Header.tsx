import React, { memo } from "react";
import { useNavigate } from "react-router";

const Header = () => {
  const navigate = useNavigate();
  const onNavigateHome = () => navigate("/");

  return (
    <header className="h-12 sm:h-14 bg-linear-to-r from-blue-500 to-blue-400 shadow-md">
      <div className="h-full flex items-center justify-between px-3 sm:px-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-white cursor-pointer"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              onClick={onNavigateHome}
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
          <h1
            className="text-white text-base sm:text-lg font-semibold tracking-wide select-none cursor-pointer"
            onClick={onNavigateHome}
          >
            オフライン待ち合わせ
          </h1>
        </div>
      </div>
    </header>
  );
};

export default memo(Header);
