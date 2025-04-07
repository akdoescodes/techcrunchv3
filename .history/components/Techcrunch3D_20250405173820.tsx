"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo, Suspense } from "react";
import { OrbitControls, Environment } from "@react-three/drei";
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import fontJson from "@assets/fonts/helvetiker_bold.typeface.json";

function TechText() {
  const meshRef = useRef<THREE.Mesh>(null);
  const font = useMemo(() => new FontLoader().parse(fontJson), []);

  const geometry = useMemo(() => {
    const textOptions = {
      font,
      size: 1.2,
      height: 0.3,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelSegments: 5,
    };
    
    const geo = new TextGeometry("TECHCRUNCH", textOptions);
    
    // Compute the bounding box to get exact dimensions
    geo.computeBoundingBox();
    const boundingBox = geo.boundingBox!;
    
    // Calculate center offset
    const centerOffset = -0.5 * (boundingBox.max.x - boundingBox.min.x);
    
    // Apply the offset to center the text
    geo.translate(centerOffset, 0, 0);
    
    return geo;
  }, [font]);

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <bufferGeometry attach="geometry" {...geometry} />
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

function FloatingOrb({ radius = 2.5, speed = 0.5, size = 0.1, offset = 0 }: FloatingOrbProps) {
  // ... (keep your existing FloatingOrb implementation)
}

export default function Techcrunch3D() {
  return (
    <div className="w-full h-[250px] md:h-[320px]">
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} />
        <Suspense fallback={null}>
          <TechText />
          {Array.from({ length: 10 }).map((_, i) => (
            <FloatingOrb key={i} offset={i * 0.3} radius={2.2 + i * 0.15} size={0.08} />
          ))}
          <Environment preset="sunset" />
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
}

interface FloatingOrbProps {
  radius?: number;
  speed?: number;
  size?: number;
  offset?: number;
}