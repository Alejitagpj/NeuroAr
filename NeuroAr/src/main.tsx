import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import { StoreProvider } from "./store/StoreContext";
import { AuthGate } from "./components/AuthGate";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthGate>
        <StoreProvider>
          <App />
        </StoreProvider>
      </AuthGate>
    </BrowserRouter>
  </StrictMode>
);
