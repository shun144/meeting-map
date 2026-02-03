import Map from "@/pages/map/Map";
import Chat from "./pages/chat/Chat";

const App = () => {
  return (
    <div className="h-screen overflow-y-scroll">
      <div className="flex flex-row h-full">
        <Map className="flex-1" />
        {/* <Chat className="h-full w-44" /> */}
      </div>
    </div>
  );
};

export default App;
