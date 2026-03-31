"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { Environment, OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

function generateInfinityCurve(start: THREE.Vector3, end: THREE.Vector3, curveStrength = 1): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  const segments = 200;
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const angle = t * Math.PI * 2;
    const x = Math.sin(angle);
    const y = Math.sin(angle) * Math.cos(angle);
    const z = 0;
    const scale = curveStrength * 0.5;
    points.push(new THREE.Vector3(x * scale, y * scale, z));
  }
  return points;
}

const wireConfigs = Array.from({ length: 10 }, (_, i) => {
  const angle = (i / 10) * Math.PI * 2;
  const radius = 1 + 0.15 * i;
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;
  const start = new THREE.Vector3(x, y, 0);
  const end = new THREE.Vector3(-x, -y, 0);
  return {
    points: generateInfinityCurve(start, end, 3 + i * 0.3),
    width: 0.035 + (i % 3) * 0.005,
  };
});

const Wire = ({ points, width }: any) => {
  const meshRef = useRef<THREE.Mesh>(null!);

  const geometry = useMemo(() => {
    return new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3(points),
      100,
      width,
      16,
      false
    );
  }, [points, width]);

  const material = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      transmission: 1,
      transparent: true,
      opacity: 0.7,
      thickness: 3,
      roughness: 0.01,
      metalness: 0.2,
      reflectivity: 1.2,
      ior: 1.6,
      clearcoat: 1,
      clearcoatRoughness: 0.01,
      envMapIntensity: 4,
      attenuationColor: new THREE.Color("#ffffff"),
      attenuationDistance: 0.6,
      emissive: new THREE.Color("#ffffff"),
      emissiveIntensity: 0.18,
    });
  }, []);

  return <mesh ref={meshRef} geometry={geometry} material={material} />;
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
        {wireConfigs.map((wire, i) => (
          <Wire key={i} {...wire} />
        ))}
        <EnergyCore />
        <OrbitControls enableZoom={false} enableRotate={false} enablePan={false} />
      </Canvas>
    </div>
  );
};
