import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/styles/index.css";
import "maplibre-gl/dist/maplibre-gl.css";
import App from "./App.tsx";
import RouteProvider from "./router/RouteProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouteProvider />
  </StrictMode>,
);
