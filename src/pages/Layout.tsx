import Header from "@/pages/Header";
import { memo, useEffect } from "react";
import { Outlet } from "react-router";

const Layout = () => {
  return (
    <div className="h-screen overflow-y-scroll">
      <div className="flex flex-col h-full">
        <Header />
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default memo(Layout);
