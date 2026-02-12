import App from "@/App";
import { BrowserRouter, Routes, Route } from "react-router";
import MeetMap from "@/pages/map/MeetMap";
// import Sample from "@/Sample";

const RouteProvider = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          <Route path="map/:mapId" element={<MeetMap />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default RouteProvider;
