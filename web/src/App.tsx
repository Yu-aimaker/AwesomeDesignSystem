import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router";
import { Shell } from "./layout/Shell";
import { Home } from "./pages/Home";
import { Typography } from "./pages/foundations/Typography";
import { Color } from "./pages/foundations/Color";
import { Spacing } from "./pages/foundations/Spacing";
import { Radius } from "./pages/foundations/Radius";
import { Elevation } from "./pages/foundations/Elevation";
import { Motion } from "./pages/foundations/Motion";
import { Components } from "./pages/Components";
import { Knowledge } from "./pages/Knowledge";
import { KnowledgeEntry } from "./pages/KnowledgeEntry";
import { Sources } from "./pages/Sources";
import { About } from "./pages/About";
import { NotFound } from "./pages/NotFound";
import { Skeleton } from "./ds/components/Skeleton";

// three.js, GSAP and the Lottie runtime are only needed on one route.
const Animation = lazy(() => import("./pages/Animation").then((m) => ({ default: m.Animation })));

function RouteFallback() {
  return (
    <div aria-busy="true" aria-label="読み込み中" className="flex flex-col gap-4">
      <Skeleton className="h-9 w-64" />
      <Skeleton className="h-5 w-full max-w-[65ch]" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

export function App() {
  return (
    <Routes>
      <Route element={<Shell />}>
        <Route index element={<Home />} />
        <Route path="foundations/typography" element={<Typography />} />
        <Route path="foundations/color" element={<Color />} />
        <Route path="foundations/spacing" element={<Spacing />} />
        <Route path="foundations/radius" element={<Radius />} />
        <Route path="foundations/elevation" element={<Elevation />} />
        <Route path="foundations/motion" element={<Motion />} />
        <Route path="components" element={<Components />} />
        <Route
          path="animation"
          element={
            <Suspense fallback={<RouteFallback />}>
              <Animation />
            </Suspense>
          }
        />
        <Route path="knowledge" element={<Knowledge />} />
        <Route path="knowledge/:category/:slug" element={<KnowledgeEntry />} />
        <Route path="sources" element={<Sources />} />
        <Route path="about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
