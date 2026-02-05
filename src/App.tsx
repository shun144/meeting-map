import Map from "@/pages/map/Map";
import Chat from "./pages/chat/Chat";
import { useEffect } from "react";

const App = () => {
  useEffect(() => {
    navigator.serviceWorker
      .register("/sw.js", { updateViaCache: "none" })
      .then(function (registration) {
        console.log("登録成功★★");

        // 強制的に更新チェック
        registration.update();
      });
  }, []);

  return (
    // <div>
    //   <h1>Test</h1>
    // </div>
    <div className="h-screen overflow-y-scroll">
      <div className="flex flex-row h-full">
        <Map className="flex-1" />
        {/* <Chat className="h-full w-44" /> */}
      </div>
    </div>
  );
};

export default App;
