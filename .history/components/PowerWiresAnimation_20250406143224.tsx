"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { Environment, OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

const wireConfigs = [
  {
    points: generateHelixPoints({ radius: 0.3, turns: 3, height: 1.5 }),
    width: 0.03,
  },
  {
    points: generateHelixPoints({ radius: 0.4, turns: 4, height: 1.8 }),
    width: 0.035,
  },
  {
    points: generateHelixPoints({ radius: 0.5, turns: 5, height: 2 }),
    width: 0.04,
  },
];

function generateHelixPoints({ radius, turns, height }: any) {
  const points = [];
  const segments = 100;
  for (let i = 0; i <= segments; i++) {
    const t = (i / segments) * Math.PI * 2 * turns;
    const x = radius * Math.cos(t);
    const y = (height * i) / segments - height / 2;
    const z = radius * Math.sin(t);
    points.push(new THREE.Vector3(x, y, z));
  }
  return points;
}

const Wire = ({ points, width }: any) => {
  const lineRef = useRef<THREE.Mesh>(null!);

  const geometry = useMemo(() => {
    const tubeGeo = new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3(points),
      100,
      width,
      16,
      false
    );
    return tubeGeo;
  }, [points, width]);

  const material = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      transmission: 1,
      transparent: true,
      opacity: 0.85,
      thickness: 1.5,
      roughness: 0.03,
      metalness: 0.0,
      reflectivity: 1.0,
      ior: 1.52,
      clearcoat: 1.0,
      clearcoatRoughness: 0.0,
      envMapIntensity: 2.5,
      attenuationColor: new THREE.Color("#ffffff"),
      attenuationDistance: 0.1,
      emissive: new THREE.Color("#ffffff"),
      emissiveIntensity: 0.03,
    });
  }, []);

  return <mesh ref={lineRef} geometry={geometry} material={material} />;
};

const EnergyCore = () => {
  const meshRef = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    const s = 1 + 0.3 * Math.sin(clock.getElapsedTime() * 2);
    meshRef.current.scale.set(s, s, s);
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.05, 32, 32]} />
      <meshStandardMaterial emissive="#A855F7" emissiveIntensity={1.5} />
    </mesh>
  );
};

export const PowerWiresAnimation = () => {
  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 3] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[0, 0, 3]} intensity={1.5} />
        <Environment preset="studio" background={false} />
        <EffectComposer>
          <Bloom luminanceThreshold={0.1} intensity={0.4} />
        </EffectComposer>
        {wireConfigs.map((wire, i) => (
          <Wire key={i} {...wire} />
        ))}
        <EnergyCore />
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
};
