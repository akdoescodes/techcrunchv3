"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo, useState, useEffect } from "react";
import * as THREE from "three";
import { Environment, OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

const Particle = ({ startPosition, controlPoint1, controlPoint2, endPosition, speed }: any) => {
  const ref = useRef<THREE.Mesh>(null!);
  const [t, setT] = useState(0);

  useFrame(() => {
    if (t < 1) {
      setT((prev) => Math.min(1, prev + speed));
      const curve = new THREE.CubicBezierCurve3(
        startPosition,
        controlPoint1,
        controlPoint2,
        endPosition
      );
      const newPosition = curve.getPoint(t);
      ref.current.position.copy(newPosition);
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.035, 16, 16]} />
      <meshStandardMaterial
        emissive="#A855F7"
        emissiveIntensity={2.0}
        transparent
        opacity={0.95}
      />
    </mesh>
  );
};

const ParticlesAnimation = () => {
  const particles = useMemo(() => {
    const count = 60;
    const radius = 6.5;
    const list: any[] = [];

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const z = 0;

      const start = new THREE.Vector3(x, y, z);
      const mid1 = new THREE.Vector3(x * 0.9, y * 1.1, 1.8);
      const mid2 = new THREE.Vector3(x * 0.3, y * 0.2, 0.5);
      const end = new THREE.Vector3(0, 0, 0);

      list.push({
        startPosition: start,
        controlPoint1: mid1,
        controlPoint2: mid2,
        endPosition: end,
        speed: 0.01 + Math.random() * 0.015,
      });
    }

    return list;
  }, []);

  return (
    <>
      {particles.map((p, i) => (
        <Particle
          key={i}
          startPosition={p.startPosition}
          controlPoint1={p.controlPoint1}
          controlPoint2={p.controlPoint2}
          endPosition={p.endPosition}
          speed={p.speed}
        />
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
      <sphereGeometry args={[0.15, 32, 32]} />
      <meshStandardMaterial emissive="#A855F7" emissiveIntensity={2.2} />
    </mesh>
  );
};

export const PowerWiresAnimation = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 10] }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[0, 0, 6]} intensity={2.5} />
        <Environment preset="studio" background={false} />
        <EffectComposer>
          <Bloom luminanceThreshold={0.1} intensity={0.65} />
        </EffectComposer>
        <ParticlesAnimation />
        <EnergyCore />
        <OrbitControls enableZoom={false} enableRotate={false} enablePan={false} />
      </Canvas>
    </div>
  );
};
