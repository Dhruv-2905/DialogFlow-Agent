import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import { keycloakConfig } from "./keycloakConfig";
import { ErrorBoundary } from "react-error-boundary";

const root = ReactDOM.createRoot(document.getElementById("root"));
const initOptions = {
  onLoad: "login-required",
  redirectUri: window.location.origin,
  pkceMethod: "S256",
  checkLoginIframe: false,
};

root.render(
  <ErrorBoundary fallback={<div>Something went wrong</div>}>
    <BrowserRouter>
      <ReactKeycloakProvider
        authClient={keycloakConfig}
        initOptions={initOptions}
      >
        <App />
      </ReactKeycloakProvider>
    </BrowserRouter>
  </ErrorBoundary>
);
