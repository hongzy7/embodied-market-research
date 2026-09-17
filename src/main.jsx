import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles/globals.css";
import "./styles/black-theme.css";

const base = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");
let pathname = window.location.pathname;
if (base && pathname.startsWith(base)) pathname = pathname.slice(base.length);
pathname = pathname.replace(/\/+$/, "") || "/";

let view = "home";
let reportDate = null;
if (pathname === "/landscape") view = "landscape";
else if (pathname === "/directory") view = "directory";
else if (pathname === "/daily") view = "daily";
else if (pathname === "/capital") view = "capital";
else if (pathname === "/arms") view = "arms";
else {
  const match = pathname.match(/^\/daily\/(\d{4}-\d{2}-\d{2})$/);
  if (match) {
    view = "report";
    reportDate = match[1];
  }
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App view={view} reportDate={reportDate} />
  </React.StrictMode>,
);
