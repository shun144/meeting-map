import Home from "@/features/home/components/Home";
import Layout from "@/features/layout/components/Layout";
import Map from "@/features/map/components/Map";
import { BrowserRouter, Route, Routes } from "react-router";

const RouteProvider = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="map/:mapId" element={<Map />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default RouteProvider;
