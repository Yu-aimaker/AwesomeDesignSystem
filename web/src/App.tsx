import { lazy, Suspense, type ComponentType } from "react";
import { Route, Routes } from "react-router";
import { Navigate } from "./i18n/router";
import { useT } from "./i18n/context";
import { shellMessages } from "./i18n/messages/shell";
import { localeMeta, locales } from "./i18n/locales";
import { Shell } from "./layout/Shell";
import { ErrorBoundary } from "./layout/ErrorBoundary";
import { Home } from "./pages/Home";
import { Skeleton } from "./ds/components/Skeleton";

// Every route below the home page is code-split. A route that fails to load
// shows an error state instead of a blank page.
function page<T extends Record<string, ComponentType>>(loader: () => Promise<T>, name: keyof T) {
  const C = lazy(() => loader().then((m) => ({ default: m[name] as ComponentType })));
  return (
    <ErrorBoundary>
      <Suspense fallback={<RouteFallback />}>
        <C />
      </Suspense>
    </ErrorBoundary>
  );
}

function RouteFallback() {
  const t = useT(shellMessages);
  return (
    // One viewport tall, so the footer stays below the fold while a route loads and does not jump (CLS).
    <div aria-busy="true" aria-label={t.loading} className="flex min-h-[calc(100dvh-var(--site-topbar))] flex-col gap-4">
      <Skeleton className="h-12 w-64 max-w-full" />
      <Skeleton className="h-5 w-full max-w-[48ch]" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="overflow-hidden rounded-lg border border-hairline bg-surface">
            <Skeleton className="aspect-[1200/630] w-full rounded-none" />
            <div className="flex flex-col gap-2 p-4">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// One route table, mounted once per locale: `/sources` and `/en/sources`
// render the same page; the page reads the locale from the URL.
function pageRoutes() {
  return (
    <>
      <Route index element={<Home />} />
      <Route path="foundations" element={page(() => import("./pages/FoundationsIndex"), "FoundationsIndex")} />
      <Route path="foundations/typography" element={page(() => import("./pages/foundations/Typography"), "Typography")} />
      <Route path="foundations/color" element={page(() => import("./pages/foundations/Color"), "Color")} />
      <Route path="foundations/spacing" element={page(() => import("./pages/foundations/Spacing"), "Spacing")} />
      <Route path="foundations/radius" element={page(() => import("./pages/foundations/Radius"), "Radius")} />
      <Route path="foundations/elevation" element={page(() => import("./pages/foundations/Elevation"), "Elevation")} />
      <Route path="foundations/motion" element={page(() => import("./pages/foundations/Motion"), "Motion")} />
      <Route path="fonts" element={page(() => import("./pages/Fonts"), "Fonts")} />
      <Route path="palettes" element={page(() => import("./pages/Palettes"), "Palettes")} />
      <Route path="components" element={page(() => import("./pages/Components"), "Components")} />
      <Route path="motion" element={page(() => import("./pages/Motion"), "MotionGallery")} />
      <Route path="animation" element={<Navigate to="/motion" replace />} />
      <Route path="stack" element={page(() => import("./pages/Stack"), "Stack")} />
      <Route path="rankings" element={page(() => import("./pages/Rankings"), "Rankings")} />
      <Route path="report" element={page(() => import("./pages/Report"), "Report")} />
      <Route path="slides" element={page(() => import("./pages/Slides"), "Slides")} />
      <Route path="anti-slop" element={page(() => import("./pages/AntiSlop"), "AntiSlop")} />
      <Route path="knowledge" element={page(() => import("./pages/Knowledge"), "Knowledge")} />
      <Route path="knowledge/:category/:slug" element={page(() => import("./pages/KnowledgeEntry"), "KnowledgeEntry")} />
      <Route path="sources" element={page(() => import("./pages/Sources"), "Sources")} />
      <Route path="about" element={page(() => import("./pages/About"), "About")} />
      <Route path="*" element={page(() => import("./pages/NotFound"), "NotFound")} />
    </>
  );
}

export function App() {
  return (
    <Routes>
      <Route element={<Shell />}>{pageRoutes()}</Route>
      {locales
        .filter((l) => localeMeta[l].prefix)
        .map((l) => (
          <Route key={l} path={localeMeta[l].prefix} element={<Shell />}>
            {pageRoutes()}
          </Route>
        ))}
    </Routes>
  );
}
