import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Edges } from "@react-three/drei";
import type { Mesh } from "three";
import { useReducedMotion, useResolvedTheme } from "../lib/theme";
import { colorValue } from "../lib/tokens";

function Solid({ ink, accent, spin }: { ink: string; accent: string; spin: boolean }) {
  const ref = useRef<Mesh>(null);
  useFrame((_, delta) => {
    if (!spin || !ref.current) return;
    ref.current.rotation.y += delta * 0.4;
    ref.current.rotation.x += delta * 0.15;
  });
  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[1.4, 0]} />
      <meshStandardMaterial color={accent} flatShading roughness={0.8} metalness={0} />
      <Edges color={ink} threshold={15} />
    </mesh>
  );
}

/**
 * Low-poly icosahedron in accent with ink edges. The render loop stops when the
 * canvas leaves the viewport or the OS asks for reduced motion (frameloop="never").
 * Colors are read from the token file for the current theme.
 */
export function ThreeScene() {
  const wrapper = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const reduced = useReducedMotion();
  const theme = useResolvedTheme();

  useEffect(() => {
    const el = wrapper.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const spin = visible && !reduced;
  const ink = colorValue(theme, "ink");
  const accent = colorValue(theme, "accent");

  return (
    <div ref={wrapper} className="h-64 w-full rounded-lg border border-hairline bg-canvas-soft">
      <Canvas
        frameloop={spin ? "always" : "demand"}
        dpr={[1, 2]}
        camera={{ position: [0, 0, 4.5], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        aria-label="回転する多面体"
        role="img"
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[3, 4, 5]} intensity={1.6} />
        <Solid ink={ink} accent={accent} spin={spin} />
      </Canvas>
    </div>
  );
}
