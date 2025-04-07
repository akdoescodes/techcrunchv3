"use client";
import { Canvas } from "@react-three/fiber";
import { useRef, useState, useEffect, Suspense } from "react";
import { OrbitControls, Environment, Text3D, Center } from "@react-three/drei";
import * as THREE from "three";

function TechText() {
  const meshRef = useRef(null);
  
  return (
    <Center>
      <Text3D
        ref={meshRef}
        font="/fonts/helvetiker_bold.json" // Path to your font in public directory
        size={0.8}
        height={0.15}
        curveSegments={8}
        bevelEnabled={true}
        bevelThickness={0.01}
        bevelSize={0.02}
        bevelSegments={3}
      >
        TECHCRUNCH
        <meshStandardMaterial
          color="#ffffff"
          emissive="#a855f7"
          emissiveIntensity={1.5}
          roughness={0.2}
          metalness={0.6}
        />
      </Text3D>
    </Center>
  );
}

export default function Techcrunch3D() {
  return (
    <div className="w-full h-64 bg-black">
      <Canvas
        camera={{ 
          position: [0, 0, 5], 
          fov: 40,
          near: 0.1,
          far: 1000
        }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={["#000000"]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <pointLight position={[-5, -5, -5]} intensity={0.3} />
        
        <Suspense fallback={null}>
          <TechText />
          <Environment preset="city" />
        </Suspense>
        
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 2.5}
          maxPolarAngle={Math.PI / 1.5}
          autoRotate
          autoRotateSpeed={1}
        />
      </Canvas>
    </div>
  );
}