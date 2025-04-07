"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo, useState, useEffect } from "react";
import * as THREE from "three";
import { Environment, OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

const Particle = ({ startPosition, curveControl1, curveControl2, speed }: any) => {
  const ref = useRef<THREE.Mesh>(null!);
  const [t, setT] = useState(0);

  useFrame(() => {
    if (t < 1) {
      setT((prev) => Math.min(1, prev + speed));
      const newPosition = new THREE.CubicBezierCurve3(
        startPosition,
        curveControl1,
        curveControl2,
        new THREE.Vector3(0, 0, 0)
      ).getPoint(t);
      ref.current.position.copy(newPosition);
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.04, 16, 16]} />
      <meshStandardMaterial
        emissive="#A855F7"
        emissiveIntensity={1.5}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
};

const ParticlesAnimation = () => {
  const particles = useMemo(() => {
    const count = 40;
    const radius = 7;
    const list: any[] = [];

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const z = 0;

      const startPosition = new THREE.Vector3(x, y, z);
      const curveControl1 = new THREE.Vector3(x * 0.6, y * 1.2, z + 1.5);
      const curveControl2 = new THREE.Vector3(x * 0.2, y * 0.5, z + 0.3);
      list.push({ startPosition, curveControl1, curveControl2, speed: 0.01 + Math.random() * 0.01 });
    }

    return list;
  }, []);

  return (
    <>
      {particles.map((p, i) => (
        <Particle
          key={i}
          startPosition={p.startPosition}
          curveControl1={p.curveControl1}
          curveControl2={p.curveControl2}
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
      <sphereGeometry args={[0.1, 32, 32]} />
      <meshStandardMaterial emissive="#A855F7" emissiveIntensity={1.8} />
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
