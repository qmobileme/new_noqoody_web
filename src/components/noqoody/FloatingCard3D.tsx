// Ported from the Noqoody Profile project (noqoody-profile.lovable.app).
// Vendored page code — type checking relaxed for the copied markup.
/* eslint-disable */
// @ts-nocheck
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { RoundedBox, Float } from "@react-three/drei";

function Card({ color = "#E30613" }: { color?: string }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((s) => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(s.clock.elapsedTime * 0.6) * 0.4;
      ref.current.rotation.x = Math.cos(s.clock.elapsedTime * 0.4) * 0.15;
    }
  });
  return (
    <Float speed={1.4} floatIntensity={0.6}>
      <RoundedBox ref={ref} args={[2.4, 1.5, 0.08]} radius={0.12} smoothness={6}>
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.25} emissive={color} emissiveIntensity={0.15} />
      </RoundedBox>
    </Float>
  );
}

export default function FloatingCard3D({ color }: { color?: string }) {
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 4], fov: 40 }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 4, 5]} intensity={1.4} />
      <pointLight position={[-3, -2, 2]} intensity={1} color="#F39200" />
      <Card color={color} />
    </Canvas>
  );
}