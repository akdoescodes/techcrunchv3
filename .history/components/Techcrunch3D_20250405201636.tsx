// Cinematic Atomic Scene
"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text3D, Stars } from "@react-three/drei";
import { EffectComposer, Afterimage, ChromaticAberration } from "@react-three/postprocessing";
import * as THREE from "three";
import { useRef } from "react";
import helvetiker from "three/examples/fonts/helvetiker_bold.typeface.json";

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
      <sphereGeometry args={[1.5, 64, 64]} />
      <meshStandardMaterial
        color="#8000FF"
        emissive="#8000FF"
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  );
}

function OrbitingElectron({ angleOffset = 0, tilt = 0 }) {
  const electronRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 2;
    const r = 4;
    const angle = t + angleOffset;
    const x = Math.cos(angle) * r;
    const z = Math.sin(angle) * r;
    const y = Math.sin(t + angleOffset) * 0.5;

    if (electronRef.current) {
      electronRef.current.position.set(x, y, z);
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
      height={0.2}
      bevelEnabled
      bevelSize={0.02}
      bevelThickness={0.04}
      position={[-4.5, -3.5, 0]}
    >
      TECHCRUNCH
      <meshStandardMaterial
        color="#8000FF"
        emissive="#8000FF"
        emissiveIntensity={1.5}
        metalness={0.9}
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
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#8000FF" />

        <OrbitControls enableZoom={false} enableRotate={false} />

        <PulsingNucleus />
        <OrbitingElectron angleOffset={0} tilt={0} />
        <OrbitingElectron angleOffset={Math.PI / 2} tilt={Math.PI / 4} />
        <OrbitingElectron angleOffset={Math.PI} tilt={Math.PI / 6} />
        <OrbitingElectron angleOffset={(3 * Math.PI) / 2} tilt={Math.PI / 3} />

        <OrbitRing tilt={0} />
        <OrbitRing tilt={Math.PI / 4} />
        <OrbitRing tilt={Math.PI / 6} />

        <TechcrunchText />

        <EffectComposer>
          <Afterimage damping={0.96} />
          <ChromaticAberration offset={[0.001, 0.001]} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
