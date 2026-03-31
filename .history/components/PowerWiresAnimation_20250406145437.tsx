"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { Environment, OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

function generateFlowPath(start: THREE.Vector3, end: THREE.Vector3, curveFactor = 100): THREE.Vector3[] {
  const points = [];
  const segments = 100;
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const angle = Math.PI * t; // semi-circle pattern
    const radius = start.distanceTo(end) / 2 * curveFactor;
    const center = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);

    const isLeft = end.x < 0;
    const direction = isLeft ? 1 : -1;

    const x = center.x + direction * radius * Math.cos(angle);
    const y = center.y + radius * Math.sin(angle);
    const z = center.z;

    points.push(new THREE.Vector3(x, y, z));
  }
  return points;
}

const screenWidth = typeof window !== "undefined" ? window.innerWidth : 1920;
const screenHeight = typeof window !== "undefined" ? window.innerHeight : 1080;

const wireConfigs = [
  [-screenWidth / 2, -screenHeight / 2.2, 0],
  [-screenWidth / 2.1, -screenHeight / 3.2, 0],
  [-screenWidth / 2.2, 0, 0],
  [-screenWidth / 2.1, screenHeight / 3.2, 0],
  [-screenWidth / 2, screenHeight / 2.2, 0],
  [screenWidth / 2, -screenHeight / 2.2, 0],
  [screenWidth / 2.1, -screenHeight / 3.2, 0],
  [screenWidth / 2.2, 0, 0],
  [screenWidth / 2.1, screenHeight / 3.2, 0],
  [screenWidth / 2, screenHeight / 2.2, 0],
].map((end, i) => ({
  points: generateFlowPath(new THREE.Vector3(0, 0, 0), new THREE.Vector3(...end), 1),
  width: 0.035 + (i % 3) * 0.005,
}));

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