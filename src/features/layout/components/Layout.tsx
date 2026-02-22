import Header from "@/features/layout/components/Header";
import { memo, useEffect } from "react";
import { Outlet } from "react-router";
import { ToastContainer } from "react-toastify";

const Layout = () => {
  return (
    <div className="h-dvh flex flex-col overflow-hidden">
      <Header />
      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={4000}
        hideProgressBar={false}
        closeOnClick={true}
        pauseOnHover={true}
      />
    </div>
  );
};

export default memo(Layout);
