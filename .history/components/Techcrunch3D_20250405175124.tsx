"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, Suspense } from "react";
import { OrbitControls, Environment } from "@react-three/drei";
import * as THREE from "three";

const LETTER_WIDTH = 0.8;
const LETTER_HEIGHT = 1.5;
const LETTER_DEPTH = 0.3;
const LETTER_SPACING = 1.0;

function LetterBlock({ char, position }: { char: string; position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (meshRef.current) {
      // Add subtle floating animation
      meshRef.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * 2) * 0.1;
    }
  });

  return (
    <group position={position}>
      {/* Main letter block */}
      <mesh ref={meshRef}>
        <boxGeometry args={[LETTER_WIDTH, LETTER_HEIGHT, LETTER_DEPTH]} />
        <meshStandardMaterial 
          color="#a855f7" 
          metalness={0.8} 
          roughness={0.2} 
          emissive="#a855f7"
          emissiveIntensity={0.3}
        />
      </mesh>
      
      {/* Add some decorative elements */}
      <mesh position={[0, LETTER_HEIGHT/2 + 0.2, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#ffffff" emissive="#00ffcc" emissiveIntensity={1} />
      </mesh>
    </group>
  );
}

function TechcrunchObject() {
  // Define positions for each "block letter"
  const letters = [
    { char: 'T', pos: [-6, 0, 0] },
    { char: 'E', pos: [-4.2, 0, 0] },
    { char: 'C', pos: [-2.4, 0, 0] },
    { char: 'H', pos: [-0.6, 0, 0] },
    { char: 'C', pos: [1.2, 0, 0] },
    { char: 'R', pos: [3.0, 0, 0] },
    { char: 'U', pos: [4.8, 0, 0] },
    { char: 'N', pos: [6.6, 0, 0] },
    { char: 'C', pos: [8.4, 0, 0] },
    { char: 'H', pos: [10.2, 0, 0] },
  ];

  return (
    <group>
      {letters.map((letter, index) => (
        <LetterBlock key={index} char={letter.char} position={letter.pos} />
      ))}
    </group>
  );
}

export default function Techcrunch3D() {
  return (
    <div className="w-full h-[400px] md:h-[600px] rounded-xl overflow-hidden bg-black">
      <Canvas camera={{ position: [0, 0, 20], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <Suspense fallback={null}>
          <TechcrunchObject />
          <Environment preset="dawn" />
        </Suspense>
        
        <OrbitControls 
          enableZoom={true}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}