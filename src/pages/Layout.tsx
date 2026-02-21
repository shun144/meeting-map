import Header from "@/pages/Header";
import { memo, useEffect } from "react";
import { Outlet } from "react-router";
import { ToastContainer } from "react-toastify";

const Layout = () => {
  return (
    <div className="h-screen overflow-y-scroll">
      <div className="flex flex-col h-full">
        <Header />
        <div className="flex-1">
          <Outlet />
        </div>
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
