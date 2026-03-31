"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { Environment, OrbitControls, Sphere } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

const Particle = ({ position, speed }: any) => {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame(() => {
    if (ref.current) {
      ref.current.position.lerp(new THREE.Vector3(0, 0, 0), speed);
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.05, 16, 16]} />
      <meshStandardMaterial
        emissive="#A855F7"
        emissiveIntensity={2}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
};

const ParticlesAnimation = () => {
  const particles = useMemo(() => {
    const sides = 30;
    const positions: any[] = [];
    for (let i = 0; i < sides; i++) {
      const angle = (i / sides) * Math.PI * 2;
      const radius = 5;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      positions.push({ position: new THREE.Vector3(x, y, 0), speed: 0.01 + Math.random() * 0.015 });
    }
    return positions;
  }, []);

  return (
    <>
      {particles.map((p, i) => (
        <Particle key={i} position={p.position} speed={p.speed} />
      ))}
    </>
  );
};

const EnergyCore = () => {
  const meshRef = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    const s = 1 + 0.3 * Math.sin(clock.getElapsedTime() * 2);
    meshRef.current.scale.set(s, s, s);
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.08, 32, 32]} />
      <meshStandardMaterial emissive="#A855F7" emissiveIntensity={1.8} />
    </mesh>
  );
};

export const PowerWiresAnimation = () => {
  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 8] }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[0, 0, 6]} intensity={2} />
        <Environment preset="studio" background={false} />
        <EffectComposer>
          <Bloom luminanceThreshold={0.1} intensity={0.6} />
        </EffectComposer>
        <ParticlesAnimation />
        <EnergyCore />
        <OrbitControls enableZoom={false} enableRotate={false} enablePan={false} />
      </Canvas>
    </div>
  );
};
