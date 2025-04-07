"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, Suspense } from "react";
import { OrbitControls, Environment } from "@react-three/drei";
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import fontJson from "@assets/fonts/helvetiker_bold.typeface.json";
import { useRef, useMemo } from "react";





// Extend THREE with TextGeometry so it works in JSX
THREE.TextGeometry = TextGeometry;

interface FloatingOrbProps {
  radius?: number;
  speed?: number;
  size?: number;
  offset?: number;
}

function FloatingOrb({ radius = 2.5, speed = 0.5, size = 0.1, offset = 0 }: FloatingOrbProps) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed + offset;
    const x = Math.cos(t) * radius;
    const y = Math.sin(t * 1.5) * 0.7;
    const z = Math.sin(t) * radius;
    if (ref.current) ref.current.position.set(x, y, z);
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[size, 16, 16]} />
      <meshStandardMaterial emissive={"#00ffcc"} color={"#00ffcc"} emissiveIntensity={2} />
    </mesh>
  );
}



function TechText() {
  const meshRef = useRef<THREE.Mesh>(null);

  const font = new FontLoader().parse(fontJson);

  const geometry = useMemo(() => {
    const geo = new TextGeometry("TECHCRUNCH", {
      font,
      size: 1.2,
      height: 0.3,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelSegments: 5,
    });
    geo.center(); // ✅ This perfectly centers the geometry in 3D space
    return geo;
  }, [font]);

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial
        color={"#ffffff"}
        emissive={"#a855f7"}
        emissiveIntensity={2}
        roughness={0.2}
        metalness={0.6}
      />
    </mesh>
  );
}

export default TechText;


export default function Techcrunch3D() {
  return (
    <div className="w-full h-[250px] md:h-[320px]">
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} />
        <Suspense fallback={null}>
          <TechText />

          {/* Add several floating orbiting code-like objects */}
          {Array.from({ length: 10 }).map((_, i) => (
            <FloatingOrb key={i} offset={i * 0.3} radius={2.2 + i * 0.15} size={0.08} />
          ))}

          {/* Optional realistic lighting tone */}
          <Environment preset="sunset" />
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
}
