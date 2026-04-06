import Header from "@/components/ui/Header";
import { memo, useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router";
import { ToastContainer } from "react-toastify";

const Layout = () => {
  const { pathname } = useLocation();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div ref={scrollRef} className="h-dvh overflow-y-scroll">
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
