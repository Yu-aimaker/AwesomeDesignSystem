import { Suspense, lazy, type ComponentType, type LazyExoticComponent } from "react";
import type { IcosahedronSceneProps } from "./ThreeScene";
import type { ParticleFieldProps } from "./ThreeParticles";
import type { WireframeTorusProps } from "./ThreeTorus";
import type { LottieProgressProps, LottieDotsProps } from "./LottieDemo";
import type { StickyStackProps } from "./GsapStack";
import type { HorizontalPanProps } from "./GsapPan";
import { useT } from "../i18n/context";
import { demosMessages } from "../i18n/messages/demos";

/*
 * Lazy wrappers for the heavy libraries (three, gsap, lottie). Only type
 * imports point at the heavy files, so importing this module, or the registry,
 * pulls none of them until a demo is rendered.
 */

function Fallback({ className = "h-64" }: { className?: string }) {
  const msg = useT(demosMessages);
  return <div aria-busy="true" aria-label={msg.loading} className={`w-full max-w-md animate-pulse rounded-lg bg-surface-sunken ${className}`} />;
}

function withSuspense<P extends object>(Lazy: LazyExoticComponent<ComponentType<P>>, fallbackClass?: string) {
  return function Heavy(props: P) {
    return (
      <Suspense fallback={<Fallback className={fallbackClass} />}>
        <Lazy {...props} />
      </Suspense>
    );
  };
}

export const LazyIcosahedron = withSuspense(lazy(() => import("./ThreeScene").then((m) => ({ default: m.IcosahedronScene }))) as LazyExoticComponent<ComponentType<IcosahedronSceneProps>>);
export const LazyParticleField = withSuspense(lazy(() => import("./ThreeParticles").then((m) => ({ default: m.ParticleField }))) as LazyExoticComponent<ComponentType<ParticleFieldProps>>);
export const LazyWireframeTorus = withSuspense(lazy(() => import("./ThreeTorus").then((m) => ({ default: m.WireframeTorus }))) as LazyExoticComponent<ComponentType<WireframeTorusProps>>);
export const LazyLottieProgress = withSuspense(lazy(() => import("./LottieDemo").then((m) => ({ default: m.LottieProgress }))) as LazyExoticComponent<ComponentType<LottieProgressProps>>, "h-48");
export const LazyLottieDots = withSuspense(lazy(() => import("./LottieDemo").then((m) => ({ default: m.LottieDots }))) as LazyExoticComponent<ComponentType<LottieDotsProps>>, "h-24");
export const LazyStickyStack = withSuspense(lazy(() => import("./GsapStack").then((m) => ({ default: m.StickyStack }))) as LazyExoticComponent<ComponentType<StickyStackProps>>, "h-80");
export const LazyHorizontalPan = withSuspense(lazy(() => import("./GsapPan").then((m) => ({ default: m.HorizontalPan }))) as LazyExoticComponent<ComponentType<HorizontalPanProps>>, "h-80");
