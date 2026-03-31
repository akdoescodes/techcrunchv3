// components/TechcrunchAura.tsx
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

export default function TechcrunchAura() {
  return (
    <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 60 }}
        gl={{ alpha: true }} // Enable transparency
      >
        <ambientLight intensity={1} />
        <Particles />
      </Canvas>
    </div>
  );
}

function Particles({ count = 5000 }) {
  const ref = useRef<THREE.Points>(null!);
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const r = Math.random() * 2;
    const theta = Math.random() * 2 * Math.PI;
    const phi = Math.acos(2 * Math.random() - 1);
    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);
    positions.set([x, y, z], i * 3);
  }

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.06;
      ref.current.rotation.x = clock.getElapsedTime() * 0.03;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled>
      <PointMaterial
        transparent
        color="#d946ef"
        size={0.015}
        sizeAttenuation
        depthWrite={false}
      />
    </Points>
  );
}
