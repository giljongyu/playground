import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { PairingProvider } from "@payhereinc/pairing-ui";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PairingProvider>
      <App />
    </PairingProvider>
  </StrictMode>
);
