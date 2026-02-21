import Home from "@/pages/Home";
import Layout from "@/pages/Layout";
import MeetMap from "@/features/map/components/MeetMap";
import { BrowserRouter, Route, Routes } from "react-router";

const RouteProvider = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="map/:mapId" element={<MeetMap />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default RouteProvider;
