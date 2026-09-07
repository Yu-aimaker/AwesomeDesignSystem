import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Edges } from "@react-three/drei";
import type { Mesh } from "three";
import { useReducedMotion } from "../lib/theme";
import { useInViewport, useTokenColors } from "./shared";

export interface IcosahedronSceneProps {
  speed?: number; // radians per second around y
  detail?: number; // 0..2 subdivisions
  wireframe?: boolean;
}

function Solid({ ink, accent, spin, speed, detail, wireframe }: { ink: string; accent: string; spin: boolean; speed: number; detail: number; wireframe: boolean }) {
  const ref = useRef<Mesh>(null);
  useFrame((_, delta) => {
    if (!spin || !ref.current) return;
    ref.current.rotation.y += delta * speed;
    ref.current.rotation.x += delta * speed * 0.375;
  });
  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[1.4, detail]} />
      <meshStandardMaterial color={accent} flatShading roughness={0.8} metalness={0} wireframe={wireframe} />
      {!wireframe && <Edges color={ink} threshold={15} />}
    </mesh>
  );
}

/**
 * Low-poly icosahedron in accent with ink edges. The render loop stops when the
 * canvas leaves the viewport or the OS asks for reduced motion (frameloop
 * "demand" draws one frame). Colors come from the CSS variables on <html>, so
 * the accent knob and theme apply.
 */
export function IcosahedronScene({ speed = 0.4, detail = 0, wireframe = false }: IcosahedronSceneProps) {
  const wrapper = useRef<HTMLDivElement>(null);
  const visible = useInViewport(wrapper);
  const reduced = useReducedMotion();
  const colors = useTokenColors(["ink", "accent"]);
  const spin = visible && !reduced;

  return (
    <div ref={wrapper} className="h-64 w-full rounded-lg border border-hairline bg-canvas-soft">
      <Canvas frameloop={spin ? "always" : "demand"} dpr={[1, 2]} camera={{ position: [0, 0, 4.5], fov: 45 }} gl={{ alpha: true, antialias: true }} aria-label="回転する多面体" role="img">
        <ambientLight intensity={1.2} />
        <directionalLight position={[3, 4, 5]} intensity={1.6} />
        <Solid ink={colors.ink} accent={colors.accent} spin={spin} speed={speed} detail={detail} wireframe={wireframe} />
      </Canvas>
    </div>
  );
}

/** Compatibility export for the pre-registry animation page. */
export function ThreeScene() {
  return <IcosahedronScene />;
}
