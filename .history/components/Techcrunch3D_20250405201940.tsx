// Cinematic Atomic Scene
"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text3D } from "@react-three/drei";
import * as THREE from "three";
import { useRef } from "react";
const helvetiker = require("three/examples/fonts/helvetiker_bold.typeface.json");

function PulsingNucleus() {
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const scale = 1 + Math.sin(t * 5) * 0.05;
    if (coreRef.current) {
      coreRef.current.scale.set(scale, scale, scale);
      coreRef.current.material.emissiveIntensity = 1 + Math.sin(t * 10) * 0.3;
    }
  });

  return (
    <mesh ref={coreRef}>
      <sphereGeometry args={[1.3, 64, 64]} />
      <meshStandardMaterial
        color="#8000FF"
        emissive="#8000FF"
        emissiveIntensity={1.5}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  );
}

function OrbitingElectron({ angleOffset = 0, tilt = 0 }) {
  const electronRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 5;
    const r = 4;
    const angle = t + angleOffset;
    const x = Math.cos(angle) * r;
    const z = Math.sin(angle) * r;
    const y = Math.sin(t + angleOffset) * 0.2;

    if (electronRef.current) {
      const position = new THREE.Vector3(x, y, z);
      position.applyAxisAngle(new THREE.Vector3(1, 0, 0), tilt);
      electronRef.current.position.set(position.x, position.y, position.z);
    }
  });

  return (
    <mesh ref={electronRef}>
      <sphereGeometry args={[0.2, 16, 16]} />
      <meshStandardMaterial
        color="#00FF88"
        emissive="#00FF88"
        emissiveIntensity={2}
        metalness={0.6}
        roughness={0.1}
      />
    </mesh>
  );
}

function OrbitRing({ tilt = 0 }) {
  return (
    <mesh rotation={[tilt, 0, 0]}>
      <ringGeometry args={[3.95, 4.05, 64]} />
      <meshBasicMaterial
        color="#00FFFF"
        transparent
        opacity={0.3}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function TechcrunchText() {
  return (
    <Text3D
      font={helvetiker}
      size={0.8}
      height={0.3}
      bevelEnabled
      bevelSize={0.03}
      bevelThickness={0.1}
      position={[-4.5, -3.5, 0]}
    >
      TECHCRUNCH
      <meshStandardMaterial
        attach="material"
        color="#8000FF"
        emissive="#8000FF"
        emissiveIntensity={2}
        metalness={1}
        roughness={0.1}
      />
    </Text3D>
  );
}

export default function CinematicAtomicScene() {
  return (
    <div className="w-full h-screen bg-white">
      <Canvas shadows camera={{ position: [0, 0, 15], fov: 50 }}>
        <color attach="background" args={["#ffffff"]} />
        <ambientLight intensity={0.7} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#8000FF" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00FF88" />

        <OrbitControls enableZoom={false} enableRotate={false} />

        <PulsingNucleus />

        {/* Electrons */}
        <OrbitingElectron angleOffset={0} tilt={0} />
        <OrbitingElectron angleOffset={Math.PI / 2} tilt={Math.PI / 4} />
        <OrbitingElectron angleOffset={Math.PI} tilt={Math.PI / 6} />
        <OrbitingElectron angleOffset={(3 * Math.PI) / 2} tilt={Math.PI / 3} />

        {/* Rings */}
        <OrbitRing tilt={0} />
        <OrbitRing tilt={Math.PI / 4} />
        <OrbitRing tilt={Math.PI / 6} />

        {/* Text */}
        <TechcrunchText />
      </Canvas>
    </div>
  );
}