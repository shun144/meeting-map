import Map from "@/pages/map/MeetMap";
import Chat from "./pages/chat/Chat";
import { useEffect, useState } from "react";
import { Outlet } from "react-router";

const App = () => {
  useEffect(() => {
    navigator.serviceWorker
      .register("/sw.js", { updateViaCache: "none" })
      .then(function (registration) {
        // 強制的に更新チェック
        registration.update();
      });
  }, []);

  return (
    <div className="h-screen overflow-y-scroll">
      <div className="flex flex-col h-full">
        <div className="h-8 bg-gray-50">タイトル</div>
        <Outlet />
      </div>
    </div>
  );
};

export default App;
