// components/TechcrunchAura.tsx
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Text } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

export default function TechcrunchAura() {
  return (
    <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl bg-white shadow-inner overflow-hidden">
      <Canvas camera={{ position: [0, 0, 4.5], fov: 60 }}>
        <ambientLight intensity={1} />
        <Particles />
        <TechText />
      </Canvas>
    </div>
  );
}

function TechText() {
  return (
    <Text
      fontSize={0.8}
      color="#d946ef"
      anchorX="center"
      anchorY="middle"
      position={[0, 0, 0]}
    >
      TECHCRUNCH
    </Text>
  );
}

function Particles({ count = 5000 }) {
  const ref = useRef<THREE.Points>(null!);
  const sphere = new Float32Array(count * 3);

  // Randomly place particles in a spherical shape
  for (let i = 0; i < count; i++) {
    const r = Math.random() * 1.8;
    const theta = Math.random() * 2 * Math.PI;
    const phi = Math.acos(2 * Math.random() - 1);
    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);
    sphere.set([x, y, z], i * 3);
  }

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.08;
    }
  });

  return (
    <Points ref={ref} positions={sphere} stride={3} frustumCulled>
      <PointMaterial
        transparent
        color="#e879f9"
        size={0.015}
        sizeAttenuation
        depthWrite={false}
      />
    </Points>
  );
}
