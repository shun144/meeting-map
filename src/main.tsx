import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/styles/index.css";
import "maplibre-gl/dist/maplibre-gl.css";
import RouteProvider from "./router/RouteProvider.tsx";

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/serviceWorker.js", {
      updateViaCache: "none",
    })
    .then((registration) => {
      registration.update();
    })
    .catch((error) => {
      console.error("SW registration failed:", error);
    });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouteProvider />
  </StrictMode>,
);
