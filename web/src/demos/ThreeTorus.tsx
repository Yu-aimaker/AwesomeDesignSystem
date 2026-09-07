import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import type { Mesh } from "three";
import { useReducedMotion } from "../lib/theme";
import { useInViewport, useTokenColors } from "./shared";

export interface WireframeTorusProps {
  tilt?: number; // 0..1 how far the pointer tilts the mesh
  damping?: number; // 1..20, higher settles faster
  segments?: number; // 8..48 tube segments
  spin?: boolean;
}

function Torus({ color, tilt, damping, segments, spin, animate }: { color: string; tilt: number; damping: number; segments: number; spin: boolean; animate: boolean }) {
  const ref = useRef<Mesh>(null);
  useFrame((state, delta) => {
    const m = ref.current;
    if (!m || !animate) return;
    const targetX = -state.pointer.y * 0.6 * tilt;
    const targetY = state.pointer.x * 0.6 * tilt;
    const k = Math.min(1, delta * damping);
    m.rotation.x += (targetX - m.rotation.x) * k;
    m.rotation.y += (targetY - m.rotation.y) * k;
    if (spin) m.rotation.z += delta * 0.2;
  });
  return (
    <mesh ref={ref}>
      <torusKnotGeometry args={[1, 0.32, segments * 4, segments]} />
      <meshBasicMaterial color={color} wireframe />
    </mesh>
  );
}

/**
 * Ink wireframe torus knot that tilts toward the pointer with a damped follow.
 * No tilt under reduced motion; the loop stops off-screen.
 */
export function WireframeTorus({ tilt = 0.6, damping = 6, segments = 16, spin = false }: WireframeTorusProps) {
  const wrapper = useRef<HTMLDivElement>(null);
  const visible = useInViewport(wrapper);
  const reduced = useReducedMotion();
  const colors = useTokenColors(["ink"]);
  const animate = visible && !reduced;
  return (
    <div ref={wrapper} className="h-64 w-full rounded-lg border border-hairline bg-canvas-soft">
      <Canvas frameloop={animate ? "always" : "demand"} dpr={[1, 2]} camera={{ position: [0, 0, 4.2], fov: 45 }} gl={{ alpha: true, antialias: true }} aria-label="ワイヤーフレームのトーラス" role="img">
        <Torus color={colors.ink} tilt={tilt} damping={damping} segments={segments} spin={spin} animate={animate} />
      </Canvas>
    </div>
  );
}
