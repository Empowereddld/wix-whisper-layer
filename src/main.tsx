import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";

const rootElement = document.getElementById("root")!;

rootElement.dataset.buildMarker = "2026-05-23T16:09Z";

createRoot(rootElement).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);
