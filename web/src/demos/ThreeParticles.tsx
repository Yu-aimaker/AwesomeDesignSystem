import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import type { Group, Points } from "three";
import { useReducedMotion } from "../lib/theme";
import { useInViewport, useTokenColors } from "./shared";
import { useT } from "../i18n/context";
import { demosMessages } from "../i18n/messages/demos";

export interface ParticleFieldProps {
  count?: number; // 200..2000
  drift?: number; // 0..1 speed multiplier
  parallax?: number; // 0..1 pointer influence
  size?: number; // point size
}

function Field({ color, count, drift, parallax, size, animate }: { color: string; count: number; drift: number; parallax: number; size: number; animate: boolean }) {
  const group = useRef<Group>(null);
  const points = useRef<Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    // Deterministic pseudo-random so the field looks the same on every mount.
    let seed = 7;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647 - 0.5;
    };
    for (let i = 0; i < count; i++) {
      arr[i * 3] = rand() * 8;
      arr[i * 3 + 1] = rand() * 5;
      arr[i * 3 + 2] = rand() * 4;
    }
    return arr;
  }, [count]);

  useFrame((state, delta) => {
    if (!animate) return;
    if (points.current) points.current.rotation.y += delta * 0.05 * drift;
    if (group.current) {
      // Ease the whole field toward the pointer; no state, no re-render.
      const tx = state.pointer.y * 0.15 * parallax;
      const ty = state.pointer.x * 0.25 * parallax;
      group.current.rotation.x += (tx - group.current.rotation.x) * Math.min(1, delta * 4);
      group.current.rotation.y += (ty - group.current.rotation.y) * Math.min(1, delta * 4);
    }
  });

  return (
    <group ref={group}>
      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial color={color} size={size} sizeAttenuation transparent opacity={0.9} depthWrite={false} />
      </points>
    </group>
  );
}

/**
 * A slow-drifting point cloud in the accent color that tilts toward the pointer.
 * Pauses off-screen and under reduced motion (a single frame is drawn).
 */
export function ParticleField({ count = 800, drift = 0.5, parallax = 0.5, size = 0.035 }: ParticleFieldProps) {
  const msg = useT(demosMessages);
  const wrapper = useRef<HTMLDivElement>(null);
  const visible = useInViewport(wrapper);
  const reduced = useReducedMotion();
  const colors = useTokenColors(["accent"]);
  const animate = visible && !reduced;
  return (
    <div ref={wrapper} className="h-64 w-full rounded-lg border border-hairline bg-canvas-soft">
      <Canvas frameloop={animate ? "always" : "demand"} dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 50 }} gl={{ alpha: true, antialias: true }} aria-label={msg.particlesLabel} role="img">
        <Field color={colors.accent} count={count} drift={drift} parallax={parallax} size={size} animate={animate} />
      </Canvas>
    </div>
  );
}
