import Home from "@/features/home/components/Home";
import Layout from "@/features/layout/components/Layout";
import Map from "@/features/map/components/Map";
import { createBrowserRouter, RouterProvider } from "react-router";
import NotFound from "./NotFound";
import { MapRepository } from "@/features/map/infrastructure/MapRepository";
import { mapLoader } from "@/features/map/loader/mapLoader";
import MapNotFound from "@/features/map/components/MapNotFound";

const repo = new MapRepository();
const AppRouteProvider = () => {
  const router = createBrowserRouter([
    {
      Component: Layout,
      children: [
        { index: true, Component: Home },
        {
          path: "map/:mapId",
          Component: Map,
          errorElement: <MapNotFound />,
          loader: async ({ params }) => mapLoader(repo, params.mapId),
        },
        { path: "/map-not-found", Component: MapNotFound },
        { path: "*", Component: NotFound },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default AppRouteProvider;
