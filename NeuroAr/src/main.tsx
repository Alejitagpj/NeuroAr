import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import { StoreProvider } from "./store/StoreContext";
import { AudienceProvider } from "./store/AudienceContext";
import { AuthGate } from "./components/AuthGate";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthGate>
        <StoreProvider>
          <AudienceProvider>
            <App />
          </AudienceProvider>
        </StoreProvider>
      </AuthGate>
    </BrowserRouter>
  </StrictMode>
);
