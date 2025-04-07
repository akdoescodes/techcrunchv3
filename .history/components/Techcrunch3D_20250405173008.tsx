"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import fontJson from "@assets/fonts/helvetiker_bold.typeface.json";

function FloatingCodeOrb({ radius = 2, speed = 0.01, size = 0.1, offset = 0 }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed + offset;
    const x = Math.sin(t) * radius;
    const y = Math.cos(t * 1.2) * 0.5;
    const z = Math.cos(t) * radius;
    if (meshRef.current) {
      meshRef.current.position.set(x, y, z);
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[size, 16, 16]} />
      <meshStandardMaterial color="#00FF99" emissive="#00FF99" emissiveIntensity={2} />
    </mesh>
  );
}

function TechcrunchText() {
  const meshRef = useRef<THREE.Mesh>(null);
  const font = new FontLoader().parse(fontJson);

  const textOptions = {
    font,
    size: 1.2,
    height: 0.3,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.04,
    bevelSegments: 3,
  };

  return (
    <mesh ref={meshRef} position={[-6, 0, 0]}>
      <TextGeometry args={["TECHCRUNCH", textOptions]} />
      <meshStandardMaterial color="#ffffff" emissive="#a855f7" emissiveIntensity={1.5} metalness={0.8} roughness={0.2} />
    </mesh>
  );
}

export default function Techcrunch3D() {
  return (
    <div className="w-full h-[400px] md:h-[600px] rounded-xl overflow-hidden bg-black shadow-xl border border-purple-600">
      <Canvas camera={{ position: [0, 0, 15], fov: 50 }}>
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <pointLight position={[-10, -10, -10]} intensity={1} />

        {/* Glowing Orbs */}
        {Array.from({ length: 12 }).map((_, index) => (
          <FloatingCodeOrb key={index} radius={2 + (index % 3)} speed={0.4 + index * 0.05} offset={index} />
        ))}

        {/* 3D Glowing Text */}
        <TechcrunchText />
      </Canvas>
    </div>
  );
}
