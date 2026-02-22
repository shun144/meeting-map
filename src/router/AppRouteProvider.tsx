import Home from "@/features/home/components/Home";
import Layout from "@/features/layout/components/Layout";
import Map from "@/features/map/components/Map";
import { createBrowserRouter, RouterProvider } from "react-router";
import NotFound from "./NotFound";
import { MapRepository } from "@/features/map/infrastructure/MapRepository";

const AppRouteProvider = () => {
  const repo = new MapRepository();
  const router = createBrowserRouter([
    {
      Component: Layout,
      children: [
        { index: true, Component: Home },
        {
          path: "map/:mapId",
          Component: Map,
          errorElement: <NotFound />,
          loader: async ({ params }) => {
            const mapData = await repo.find(params.mapId);
            if (!mapData) {
              throw new Response("Not Found", { status: 404 });
            }
          },
        },
        { path: "*", Component: NotFound },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default AppRouteProvider;
