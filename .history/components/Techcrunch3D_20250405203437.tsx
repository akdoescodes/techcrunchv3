"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text3D, Trail, Float } from "@react-three/drei";
import * as THREE from "three";
import { useRef, useMemo, useState } from "react";

// Font import
const helvetiker = require("three/examples/fonts/helvetiker_bold.typeface.json");

function PulsingNucleus() {
  const coreRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const scale = 1 + Math.sin(t * 3) * 0.1;
    if (coreRef.current) {
      coreRef.current.scale.set(scale, scale, scale);
      coreRef.current.rotation.y = t * 0.2;
      coreRef.current.rotation.z = t * 0.1;
    }
    if (glowRef.current) {
      glowRef.current.scale.setScalar(1.2 + Math.sin(t * 2) * 0.1);
    }
  });

  return (
    <group>
      <mesh ref={coreRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          color="#9000FF"
          emissive="#8000FF"
          emissiveIntensity={1.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      <mesh ref={glowRef}>
        <sphereGeometry args={[1.3, 32, 32]} />
        <meshBasicMaterial color="#B066FF" transparent opacity={0.6} side={THREE.BackSide} />
      </mesh>
    </group>
  );
}

function OrbitingElectron({ angleOffset = 0, tilt = 0, speed = 1, orbitRadius = 4, size = 0.2, label = "JS", color = "#00FF88" }) {
  const electronRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed;
    const angle = t + angleOffset;
    const x = Math.cos(angle) * orbitRadius;
    const z = Math.sin(angle) * orbitRadius;
    const y = Math.sin(t * 3) * 0.3;

    if (electronRef.current) {
      const position = new THREE.Vector3(x, y, z);
      position.applyAxisAngle(new THREE.Vector3(1, 0, 0), tilt);
      electronRef.current.position.copy(position);
    }
  });

  return (
    <group>
      <Trail width={1} length={5} color={color} attenuation={(w) => w * 0.3}>
        <mesh ref={electronRef}>
          <sphereGeometry args={[size, 16, 16]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={2}
            metalness={0.6}
            roughness={0.1}
          />
        </mesh>
      </Trail>
      <Float speed={2} floatIntensity={2}>
        <Text3D
          font={helvetiker}
          size={0.15}
          height={0.02}
          position={[Math.cos(angleOffset) * orbitRadius, 0.3, Math.sin(angleOffset) * orbitRadius]}
        >
          {label}
          <meshStandardMaterial color={color} />
        </Text3D>
      </Float>
    </group>
  );
}

function OrbitRing({ tilt = 0, radius = 4, color = "#00FFFF", pulseSpeed = 1 }) {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.1;
    }
  });

  return (
    <mesh rotation={[tilt, 0, 0]} ref={ringRef}>
      <ringGeometry args={[radius - 0.05, radius + 0.05, 128]} />
      <meshBasicMaterial color={color} transparent opacity={0.3} side={THREE.DoubleSide} />
    </mesh>
  );
}

function TechcrunchText() {
  return (
    <Float speed={1.5} floatIntensity={0.5}>
      <Text3D
        font={helvetiker}
        size={0.8}
        height={0.2}
        bevelEnabled
        bevelSize={0.02}
        bevelThickness={0.05}
        position={[-4.6, -3.5, 0]}
      >
        TECHCRUNCH
        <meshStandardMaterial>
          <color attach="color" args={["white"]} />
          <gradientMap attach="map" args={["purple", "pink"]} />
        </meshStandardMaterial>
      </Text3D>
    </Float>
  );
}

export default function CinematicAtomicScene() {
  const [config] = useState(() => {
    const codingLabels = ["JS", "HTML", "CSS", "PY", "C++", "SQL", "REACT", "NODE"];
    const colors = ["#FF0077", "#FFAA00", "#66FF99", "#00FFFF", "#FF66CC", "#00DDFF", "#FF33AA", "#AAFF00"];

    const electrons = Array.from({ length: 8 }, (_, i) => ({
      angleOffset: (Math.PI * 2 * i) / 8,
      tilt: (Math.PI / 8) * i,
      speed: 1 + Math.random(),
      orbitRadius: 3 + (i % 3),
      size: 0.15,
      color: colors[i],
      label: codingLabels[i]
    }));

    const rings = [
      { tilt: 0, radius: 3.5, color: "#00FFFF" },
      { tilt: Math.PI / 4, radius: 4, color: "#33CCFF" },
      { tilt: Math.PI / 6, radius: 3.7, color: "#55AAFF" }
    ];

    return { electrons, rings };
  });

  return (
    <div className="w-full h-screen bg-white">
      <Canvas shadows camera={{ position: [0, 0, 12], fov: 45 }}>
        <color attach="background" args={["#ffffff"]} />
        <ambientLight intensity={1} />
        <pointLight position={[10, 10, 10]} intensity={1.2} color="#FF00CC" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#6600FF" />

        <OrbitControls enableZoom={false} enablePan={false} enableRotate={true} autoRotate={false} />

        <PulsingNucleus />
        {config.rings.map((r, i) => (
          <OrbitRing key={i} {...r} />
        ))}
        {config.electrons.map((e, i) => (
          <OrbitingElectron key={i} {...e} />
        ))}
        <TechcrunchText />
      </Canvas>
    </div>
  );
}
