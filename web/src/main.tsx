import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import "./styles.css";
import { App } from "./App";
import { KnobsProvider } from "./lib/knobs";
import { ThemeProvider } from "./lib/theme";
import { LocaleProvider } from "./i18n/context";
import { DocumentHead } from "./seo/DocumentHead";

const base = import.meta.env.BASE_URL.replace(/\/$/, "");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename={base}>
      <LocaleProvider>
        <DocumentHead />
        <ThemeProvider>
          <KnobsProvider>
            <App />
          </KnobsProvider>
        </ThemeProvider>
      </LocaleProvider>
    </BrowserRouter>
  </StrictMode>,
);
