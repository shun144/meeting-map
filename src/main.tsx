import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/styles/index.css";
import "maplibre-gl/dist/maplibre-gl.css";
import App from "./App.tsx";

if (import.meta.env.DEV) {
  import("eruda").then((eruda) => eruda.default.init());
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
