"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { Environment, OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

function generateCurveOutward(start: THREE.Vector3, end: THREE.Vector3, curveStrength = 1): THREE.Vector3[] {
  const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
  const dir = new THREE.Vector3().subVectors(end, start).normalize();
  const normal = new THREE.Vector3(-dir.y, dir.x, 0).normalize();
  const control1 = new THREE.Vector3().addVectors(mid, normal.multiplyScalar(curveStrength));

  const curve = new THREE.QuadraticBezierCurve3(start, control1, end);
  return curve.getPoints(100);
}

const screenWidth = typeof window !== "undefined" ? window.innerWidth : 1920;
const screenHeight = typeof window !== "undefined" ? window.innerHeight : 1080;

const positions = [
  [-screenWidth / 2.5, screenHeight / 3, 0],
  [-screenWidth / 2.5, screenHeight / 6, 0],
  [-screenWidth / 2.5, 0, 0],
  [-screenWidth / 2.5, -screenHeight / 6, 0],
  [-screenWidth / 2.5, -screenHeight / 3, 0],
  [screenWidth / 2.5, screenHeight / 3, 0],
  [screenWidth / 2.5, screenHeight / 6, 0],
  [screenWidth / 2.5, 0, 0],
  [screenWidth / 2.5, -screenHeight / 6, 0],
  [screenWidth / 2.5, -screenHeight / 3, 0]
];

const wireConfigs = positions.map((end, i) => {
  const startX = end[0] > 0 ? -100 : 100;
  const endVec = new THREE.Vector3(...end);
  const startVec = new THREE.Vector3(startX, end[1], 0);
  const curveStrength = 300 + Math.abs(2 - (i % 5)) * 100;
  return {
    points: generateCurveOutward(startVec, endVec, curveStrength),
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
