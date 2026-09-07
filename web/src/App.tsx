import { lazy, Suspense, type ComponentType } from "react";
import { Navigate, Route, Routes } from "react-router";
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
  return (
    <div aria-busy="true" aria-label="読み込み中" className="flex flex-col gap-4">
      <Skeleton className="h-12 w-64" />
      <Skeleton className="h-5 w-full max-w-[48ch]" />
      <Skeleton className="h-72 w-full" />
    </div>
  );
}

export function App() {
  return (
    <Routes>
      <Route element={<Shell />}>
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
        <Route path="knowledge" element={page(() => import("./pages/Knowledge"), "Knowledge")} />
        <Route path="knowledge/:category/:slug" element={page(() => import("./pages/KnowledgeEntry"), "KnowledgeEntry")} />
        <Route path="sources" element={page(() => import("./pages/Sources"), "Sources")} />
        <Route path="about" element={page(() => import("./pages/About"), "About")} />
        <Route path="*" element={page(() => import("./pages/NotFound"), "NotFound")} />
      </Route>
    </Routes>
  );
}
