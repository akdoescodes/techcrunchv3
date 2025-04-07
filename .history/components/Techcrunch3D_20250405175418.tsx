"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import * as THREE from "three";
import { useMemo } from "react";

const Letter = ({ char, position }: { char: string; position: [number, number, number] }) => {
  const letterParts = useMemo(() => {
    const parts: { shape: 'box' | 'cylinder'; args: any; position: [number, number, number] }[] = [];
    const thickness = 0.3;
    const height = 1.5;
    const width = 0.8;

    switch(char) {
      case 'T':
        parts.push({ shape: 'box', args: [width, thickness, thickness], position: [0, height/2, 0] }); // Top bar
        parts.push({ shape: 'box', args: [thickness, height, thickness], position: [0, 0, 0] }); // Vertical bar
        break;
      case 'E':
        parts.push({ shape: 'box', args: [width, thickness, thickness], position: [0, height/2, 0] }); // Top
        parts.push({ shape: 'box', args: [width, thickness, thickness], position: [0, 0, 0] }); // Bottom
        parts.push({ shape: 'box', args: [width, thickness, thickness], position: [0, -height/4, 0] }); // Middle
        parts.push({ shape: 'box', args: [thickness, height, thickness], position: [-width/2, 0, 0] }); // Vertical
        break;
      case 'C':
        parts.push({ shape: 'cylinder', args: [width/2, width/2, thickness, 16, 1, true, Math.PI/2, Math.PI], 
                    position: [0, 0, 0], rotation: [0, 0, Math.PI/2] });
        break;
      case 'H':
        parts.push({ shape: 'box', args: [thickness, height, thickness], position: [-width/2, 0, 0] }); // Left
        parts.push({ shape: 'box', args: [thickness, height, thickness], position: [width/2, 0, 0] }); // Right
        parts.push({ shape: 'box', args: [width, thickness, thickness], position: [0, 0, 0] }); // Middle
        break;
      case 'R':
        // Vertical line
        parts.push({ shape: 'box', args: [thickness, height, thickness], position: [-width/2, 0, 0] });
        // Top curve
        parts.push({ shape: 'cylinder', args: [width/2, width/2, thickness, 16, 1, true, 0, Math.PI/2], 
                    position: [0, height/3, 0] });
        // Diagonal
        parts.push({ shape: 'box', args: [thickness, height/2, thickness], position: [0, -height/4, 0], 
                    rotation: [0, 0, -Math.PI/4] });
        break;
      case 'U':
        parts.push({ shape: 'box', args: [thickness, height, thickness], position: [-width/2, 0, 0] }); // Left
        parts.push({ shape: 'box', args: [thickness, height, thickness], position: [width/2, 0, 0] }); // Right
        parts.push({ shape: 'cylinder', args: [width/2, width/2, thickness, 16, 1, true, Math.PI, Math.PI], 
                    position: [0, -height/2, 0] });
        break;
      case 'N':
        parts.push({ shape: 'box', args: [thickness, height, thickness], position: [-width/2, 0, 0] }); // Left
        parts.push({ shape: 'box', args: [thickness, height, thickness], position: [width/2, 0, 0] }); // Right
        parts.push({ shape: 'box', args: [thickness, height*1.2, thickness], position: [0, 0, 0], 
                    rotation: [0, 0, -Math.PI/6] }); // Diagonal
        break;
      default:
        // Default to box for unknown characters
        parts.push({ shape: 'box', args: [width, height, thickness], position: [0, 0, 0] });
    }

    return parts;
  }, [char]);

  return (
    <group position={position}>
      {letterParts.map((part, i) => (
        <mesh
          key={i}
          position={part.position}
          rotation={part.rotation || [0, 0, 0]}
        >
          {part.shape === 'box' ? (
            <boxGeometry args={part.args} />
          ) : (
            <cylinderGeometry args={part.args} />
          )}
          <meshStandardMaterial
            color="#a855f7"
            metalness={0.8}
            roughness={0.2}
            emissive="#a855f7"
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}
    </group>
  );
};

const TechcrunchObject = () => {
  const letters = [
    { char: 'T', pos: [-4.5, 0, 0] },
    { char: 'E', pos: [-3.2, 0, 0] },
    { char: 'C', pos: [-1.9, 0, 0] },
    { char: 'H', pos: [-0.6, 0, 0] },
    { char: 'C', pos: [0.7, 0, 0] },
    { char: 'R', pos: [2.0, 0, 0] },
    { char: 'U', pos: [3.3, 0, 0] },
    { char: 'N', pos: [4.6, 0, 0] },
    { char: 'C', pos: [5.9, 0, 0] },
    { char: 'H', pos: [7.2, 0, 0] },
  ];

  return (
    <group>
      {letters.map((letter, i) => (
        <Letter key={i} char={letter.char} position={letter.pos} />
      ))}
    </group>
  );
};

export default function Techcrunch3D() {
  return (
    <div className="w-full h-[500px] bg-black">
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <TechcrunchObject />
        <Environment preset="city" />
        
        <OrbitControls 
          enableZoom={true}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}