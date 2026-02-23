import Home from "@/features/home/components/Home";
import Layout from "@/features/layout/components/Layout";
import Map from "@/features/map/components/Map";
import { createBrowserRouter, RouterProvider } from "react-router";
import NotFound from "./NotFound";
import { MapRepository } from "@/features/map/infrastructure/MapRepository";
import { mapLoader } from "@/features/map/loader/mapLoader";

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
          errorElement: <NotFound />,
          loader: async ({ params }) => mapLoader(repo, params.mapId),
        },
        { path: "*", Component: NotFound },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default AppRouteProvider;
