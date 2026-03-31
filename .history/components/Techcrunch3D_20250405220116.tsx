"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text3D, Float } from "@react-three/drei";
import * as THREE from "three";
import { useRef, useMemo, useState } from "react";

const helvetiker = require("three/examples/fonts/helvetiker_bold.typeface.json");

function CentralText() {
  return (
    <Float speed={0} rotationIntensity={0} floatIntensity={0}>
      <Text3D
        font={helvetiker}
        size={1.2}
        height={0.3}
        bevelEnabled
        bevelSize={0.02}
        bevelThickness={0.1}
        position={[-1.2, -0.6, 0]} // Adjusted position for proper centering
      >
        TECHCRUNCH
        <meshStandardMaterial
          attach="material"
          color="#800080" // Purple color
          metalness={0.9}
          roughness={0.2}
        />
      </Text3D>
    </Float>
  );
}

function OrbitingElectron({ angleOffset = 0, tilt = 0, speed = 1, orbitRadius = 4, size = 0.15 }) {
  const electronRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed;
    const r = orbitRadius;
    const angle = t + angleOffset;
    const x = Math.cos(angle) * r;
    const z = Math.sin(angle) * r;
    
    if (electronRef.current) {
      const position = new THREE.Vector3(x, 0, z);
      position.applyAxisAngle(new THREE.Vector3(1, 0, 0), tilt);
      electronRef.current.position.set(position.x, position.y, position.z);
    }
  });

  return (
    <mesh ref={electronRef}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial
        color="#00AA00" // Green color
        metalness={0.9}
        roughness={0.1}
      />
    </mesh>
  );
}

function OrbitRing({ tilt = 0, radius = 4 }) {
  return (
    <mesh rotation={[tilt, 0, 0]}>
      <ringGeometry args={[radius - 0.05, radius + 0.05, 64]} />
      <meshBasicMaterial
        color="#AAAAAA"
        transparent
        opacity={0.2}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export default function AtomicScene() {
  const [orbitalConfig] = useState(() => {
    const electrons = Array.from({ length: 8 }, (_, i) => ({
      angleOffset: (Math.PI * 2 * i) / 8,
      tilt: (Math.PI / 4) * (i % 2),
      speed: 1,
      orbitRadius: 4,
      size: 0.15
    }));
    
    const rings = [
      { tilt: 0, radius: 4 },
      { tilt: Math.PI / 3, radius: 4 },
      { tilt: Math.PI / 6, radius: 4 }
    ];
    
    return { electrons, rings };
  });

  return (
    <div className="w-full h-screen bg-white">
      <Canvas shadows camera={{ position: [0, 0, 12], fov: 45 }}>
        <color attach="background" args={["#ffffff"]} />
        
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} />
        
        <OrbitControls 
          enableZoom={true} 
          enablePan={false}
          enableRotate={true}
          autoRotate={true}
          autoRotateSpeed={0.5}
        />
        
        <group position={[0, 0, 0]}> {/* Center group */}
          <CentralText />
          
          {orbitalConfig.electrons.map((config, i) => (
            <OrbitingElectron key={i} {...config} />
          ))}
          
          {orbitalConfig.rings.map((config, i) => (
            <OrbitRing key={i} {...config} />
          ))}
        </group>
      </Canvas>
    </div>
  );
}