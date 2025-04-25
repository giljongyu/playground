import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { TelemetryProvider } from "./packages/index.tsx";

createRoot(document.getElementById("root")!).render(
  <TelemetryProvider>
    <App />
  </TelemetryProvider>
);
