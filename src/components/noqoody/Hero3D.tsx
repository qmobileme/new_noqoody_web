import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, MeshDistortMaterial, Torus } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function LinkedRings() {
  const g1 = useRef<THREE.Mesh>(null!);
  const g2 = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (g1.current) {
      g1.current.rotation.y = Math.sin(t * 0.4) * 0.6;
      g1.current.rotation.x = Math.cos(t * 0.3) * 0.2;
    }
    if (g2.current) {
      g2.current.rotation.y = Math.sin(t * 0.4 + Math.PI) * 0.6;
      g2.current.rotation.x = Math.cos(t * 0.3 + Math.PI) * 0.2;
    }
  });
  return (
    <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.8}>
      <group position={[0, 0, 0]}>
        <Torus ref={g1} args={[1.4, 0.45, 64, 128]} position={[-0.9, 0, 0]} rotation={[0, 0.4, 0]}>
          <meshStandardMaterial color="#E30613" metalness={0.6} roughness={0.25} emissive="#5a0207" emissiveIntensity={0.4} />
        </Torus>
        <Torus ref={g2} args={[1.4, 0.45, 64, 128]} position={[0.9, 0, 0]} rotation={[0, -0.4, 0]}>
          <meshStandardMaterial color="#F39200" metalness={0.6} roughness={0.25} emissive="#3a2200" emissiveIntensity={0.5} />
        </Torus>
      </group>
    </Float>
  );
}

function Particles({ count = 120 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null!);
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 14;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
  }
  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.04;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#F39200" transparent opacity={0.7} sizeAttenuation />
    </points>
  );
}

function Blob() {
  return (
    <Float speed={1.5} floatIntensity={1} rotationIntensity={1}>
      <mesh position={[3.5, 1.4, -2]} scale={0.7}>
        <icosahedronGeometry args={[1, 6]} />
        <MeshDistortMaterial color="#E30613" speed={2} distort={0.4} roughness={0.2} metalness={0.8} />
      </mesh>
      <mesh position={[-3.6, -1.6, -1.5]} scale={0.55}>
        <icosahedronGeometry args={[1, 6]} />
        <MeshDistortMaterial color="#F39200" speed={1.6} distort={0.5} roughness={0.3} metalness={0.7} />
      </mesh>
    </Float>
  );
}

export default function Hero3D() {
  return (
    <Canvas dpr={[1, 1.6]} camera={{ position: [0, 0, 6], fov: 45 }} className="!absolute inset-0">
      <color attach="background" args={["#000022"]} />
      <fog attach="fog" args={["#000022", 6, 14]} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} color="#fff5e0" />
      <pointLight position={[-4, -2, 3]} intensity={1.5} color="#E30613" />
      <pointLight position={[4, 2, 3]} intensity={1.5} color="#F39200" />
      <LinkedRings />
      <Blob />
      <Particles />
      <Environment preset="night" />
    </Canvas>
  );
}