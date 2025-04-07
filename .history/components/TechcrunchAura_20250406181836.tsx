// TechcrunchAura.tsx
import { Canvas } from '@react-three/fiber'; // Import Canvas from @react-three/fiber
import { OrbitControls } from '@react-three/drei'; // Import OrbitControls from @react-three/drei
import { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';

// This component renders a simple 3D scene using React Three Fiber
const TechcrunchAura = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [lightIntensity, setLightIntensity] = useState(0.5);

  // You can animate the rotation or modify the mesh
  useEffect(() => {
    const interval = setInterval(() => {
      if (meshRef.current) {
        meshRef.current.rotation.y += 0.01; // Rotate the cube along Y-axis
      }
    }, 16); // ~60fps animation update rate
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <Canvas>
      {/* Set up a perspective camera */}
      <perspectiveCamera position={[0, 0, 5]} />

      {/* Ambient lighting and point lighting */}
      <ambientLight intensity={lightIntensity} /> 
      <pointLight position={[10, 10, 10]} intensity={1} color="white" />

      {/* A rotating cube */}
      <mesh ref={meshRef} rotation={[0.4, 0.4, 0]} position={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#ff6347" /> {/* A more vivid color for the material */}
      </mesh>

      {/* OrbitControls to allow mouse interaction */}
      <OrbitControls />
    </Canvas>
  );
};

export default TechcrunchAura;
