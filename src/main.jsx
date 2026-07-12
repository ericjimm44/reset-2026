import React from "react";
import ReactDOM from "react-dom/client";
// Self-hosted fonts — offline-friendly, no CDN.
import "@fontsource/playfair-display/400.css";
import "@fontsource/playfair-display/400-italic.css";
import "@fontsource/playfair-display/500.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import App from "./App";
import { EnsoGallery } from "./components/Enso";
import "./styles.css";

// /?enso — dev gallery for eyeballing the ring states. Doesn't touch app data.
const gallery = new URLSearchParams(window.location.search).has("enso");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {gallery ? <EnsoGallery /> : <App />}
  </React.StrictMode>
);
