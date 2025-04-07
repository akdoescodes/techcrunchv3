"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { Environment, OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

function generateButterflyCurve(start: THREE.Vector3, end: THREE.Vector3, curveStrength = 1, widthScale = 1): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  const segments = 200;
  const scale = curveStrength * 2 * widthScale;
  
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const angle = t * Math.PI * 2;
    
    // Butterfly curve equation
    const r = Math.exp(Math.cos(angle)) - 2 * Math.cos(4 * angle) - Math.pow(Math.sin(angle / 12), 5);
    const x = Math.sin(angle) * r;
    const y = Math.cos(angle) * r;
    const z = 0;
    
    points.push(new THREE.Vector3(x * scale, y * scale, z));
  }
  return points;
}

// Create 5 wires on each horizontal side (left and right)
const wireConfigs = Array.from({ length: 5 }, (_, i) => {
  const yPositions = [-0.8, -0.4, 0, 0.4, 0.8]; // Vertical positions for the wires
  const startX = 5; // Extend to edge of canvas
  const endX = -5;  // Extend to opposite edge
  
  return {
    points: generateButterflyCurve(
      new THREE.Vector3(startX, yPositions[i], 0),
      new THREE.Vector3(endX, yPositions[i], 0),
      3 + i * 0.3,
      1.5
    ),
    width: 0.035 + (i % 3) * 0.005,
  };
});

const Wire = ({ points, width }: any) => {
  const meshRef = useRef<THREE.Mesh>(null!);

  const geometry = useMemo(() => {
    return new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3(points),
      200,
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
      <sphereGeometry args={[0.1, 32, 32]} />
      <meshStandardMaterial emissive="#A855F7" emissiveIntensity={2.5} />
    </mesh>
  );
};

export const PowerWiresAnimation = () => {
  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[0, 0, 6]} intensity={2} />
        <Environment preset="studio" background={false} />
        <EffectComposer>
          <Bloom luminanceThreshold={0.1} intensity={0.8} />
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