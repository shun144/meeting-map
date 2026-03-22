import { type FC } from "react";
import { NavLink } from "react-router";
import type { Map } from "@/features/map/domains/Map";

interface Props {
  map: Map;
  isClearing: boolean;
}

const Card: FC<Props> = ({ map, isClearing }) => {
  return (
    <NavLink
      to={`/map/${map.id}`}
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
            {map.name}
          </h2>
        </div>
      </div>
    </NavLink>
  );
};

export default Card;
