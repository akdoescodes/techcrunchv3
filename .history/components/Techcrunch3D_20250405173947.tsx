"use client";

import { Canvas } from "@react-three/fiber";
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
      size: 1.0,  // Reduced from 1.2 for better fit
      height: 0.2,  // Reduced thickness
      curveSegments: 8,  // Reduced for performance
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 3,
    };
    
    const geo = new TextGeometry("TECHCRUNCH", textOptions);
    
    // Compute bounding box for precise centering
    geo.computeBoundingBox();
    const bbox = geo.boundingBox!;
    
    // Center the geometry properly
    geo.translate(
      - (bbox.max.x + bbox.min.x) / 2,  // Center X
      - (bbox.max.y + bbox.min.y) / 2,  // Center Y
      - (bbox.max.z + bbox.min.z) / 2   // Center Z
    );
    
    return geo;
  }, [font]);

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <bufferGeometry attach="geometry" {...geometry} />
      <meshStandardMaterial
        color="#ffffff"
        emissive="#a855f7"
        emissiveIntensity={2}
        roughness={0.2}
        metalness={0.6}
        side={THREE.FrontSide}  // Ensure single-sided rendering
      />
    </mesh>
  );
}

export default function Techcrunch3D() {
  return (
    <div className="w-full h-[250px] md:h-[320px]">
      <Canvas 
        camera={{ position: [0, 0, 15], fov: 45 }}  // Adjusted camera
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <Suspense fallback={null}>
          <TechText />
          <Environment preset="city" />
        </Suspense>
        
        <OrbitControls 
          enableZoom={true} 
          minDistance={5}
          maxDistance={20}
          autoRotate
          autoRotateSpeed={1.5}
        />
      </Canvas>
    </div>
  );
}