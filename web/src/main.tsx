import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import "./styles.css";
import { App } from "./App";
import { KnobsProvider } from "./lib/knobs";
import { ThemeProvider } from "./lib/theme";

const base = import.meta.env.BASE_URL.replace(/\/$/, "");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename={base}>
      <ThemeProvider>
        <KnobsProvider>
          <App />
        </KnobsProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);
