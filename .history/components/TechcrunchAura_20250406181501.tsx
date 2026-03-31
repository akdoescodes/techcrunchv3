// TechcrunchAura.tsx
import { Canvas } from '@react-three/fiber'; // Import Canvas from @react-three/fiber
import { OrbitControls } from '@react-three/drei'; // Import OrbitControls from @react-three/drei
import { useRef } from 'react';

// This component renders a simple 3D scene using React Three Fiber
const TechcrunchAura = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  return (
    <Canvas>
      {/* Lighting */}
      <ambientLight intensity={0.5} /> {/* Ambient light */}
      <pointLight position={[10, 10, 10]} /> {/* Point light to cast shadows */}

      {/* A simple rotating box */}
      <mesh ref={meshRef} rotation={[0.4, 0.4, 0]} position={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} /> {/* Box geometry */}
        <meshStandardMaterial color="orange" /> {/* Material for the box */}
      </mesh>

      {/* Orbit controls for better interaction with the scene */}
      <OrbitControls />
    </Canvas>
  );
};

export default TechcrunchAura;
