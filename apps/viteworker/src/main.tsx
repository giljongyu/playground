import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { OverlayProvider } from "overlay-kit";
import { Provider } from "./Context.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider value="hello">
      <OverlayProvider>
        <App />
      </OverlayProvider>
    </Provider>
  </StrictMode>
);
