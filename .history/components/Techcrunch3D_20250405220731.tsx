"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Float } from "@react-three/drei";
import * as THREE from "three";
import { useMemo, useRef } from "react";

const ModernAtomicDesign = () => {
  // Configuration for 8 electrons in two orbital shells
  const electrons = useMemo(() => {
    const inner = Array.from({ length: 4 }, (_, i) => ({
      angle: (Math.PI * 2 * i) / 4,
      radius: 3.5,
      speed: 1.2,
      size: 0.12,
    }));
    const outer = Array.from({ length: 4 }, (_, i) => ({
      angle: (Math.PI * 2 * i) / 4 + Math.PI / 4,
      radius: 5,
      speed: 0.8,
      size: 0.15,
    }));
    return [...inner, ...outer];
  }, []);

  return (
    <div className="w-full h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#3b82f6" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#ec4899" />

        {/* Controls */}
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
        />

        {/* Central Core - Minimalist Sphere */}
        <mesh>
          <sphereGeometry args={[1.2, 64, 64]} />
          <meshStandardMaterial
            color="#ffffff"
            metalness={0.9}
            roughness={0.1}
            envMapIntensity={1}
          />
        </mesh>

        {/* Orbital Rings - Minimalist Style */}
        <OrbitRing radius={3.5} color="#3b82f6" opacity={0.15} />
        <OrbitRing radius={5} color="#ec4899" opacity={0.1} rotation={[Math.PI/4, 0, 0]} />

        {/* Electrons */}
        {electrons.map((electron, i) => (
          <Electron key={i} {...electron} />
        ))}

        {/* Floating Text */}
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
          <Text
            font="/fonts/Inter-Bold.woff"
            fontSize={0.8}
            color="#ffffff"
            position={[0, -2.5, 0]}
            anchorX="center"
            anchorY="middle"
          >
            ATOMIC
          </Text>
        </Float>
      </Canvas>
    </div>
  );
};

// Electron component
const Electron = ({ angle, radius, speed, size }) => {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed;
    if (ref.current) {
      ref.current.position.x = Math.cos(t + angle) * radius;
      ref.current.position.z = Math.sin(t + angle) * radius;
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[size, 16, 16]} />
      <meshStandardMaterial
        color="#ffffff"
        metalness={0.9}
        roughness={0.1}
        emissive={i % 2 === 0 ? "#3b82f6" : "#ec4899"}
        emissiveIntensity={0.3}
      />
    </mesh>
  );
};

// Orbit ring component
const OrbitRing = ({ radius, color, opacity = 0.1, ...props }) => {
  return (
    <mesh {...props}>
      <ringGeometry args={[radius - 0.02, radius + 0.02, 128]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

export default ModernAtomicDesign;