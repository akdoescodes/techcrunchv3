import { Canvas } from '@react-three/fiber'; // Import Canvas from @react-three/fiber
import { OrbitControls } from '@react-three/drei'; // Import OrbitControls from @react-three/drei
import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three'; 
import SimulationMaterial from './SimulationMaterial'; // Import the custom simulation material

// Simulation component to apply the custom material
const Simulation = () => {
  // Correctly define the ref type: useRef<THREE.Mesh | null>(null)
  const meshRef = useRef<THREE.Mesh | null>(null); 

  useEffect(() => {
    const interval = setInterval(() => {
      if (meshRef.current) {
        meshRef.current.rotation.y += 0.01; // Rotate the mesh for animation
      }
    }, 16); // ~60fps update rate
    return () => clearInterval(interval); // Clean up interval
  }, []);

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 32, 32]} /> {/* Use any geometry */}
      <simulationMaterial size={256} /> {/* Apply the custom SimulationMaterial */}
    </mesh>
  );
};

const TechcrunchAura = () => {
  const [lightIntensity, setLightIntensity] = useState(0.5);

  return (
    <Canvas>
      {/* Set up the camera and lighting */}
      <perspectiveCamera position={[0, 0, 5]} />
      <ambientLight intensity={lightIntensity} />
      <pointLight position={[10, 10, 10]} intensity={1} color="white" />

      {/* Add the simulation to the scene */}
      <Simulation />

      {/* OrbitControls to allow mouse interaction */}
      <OrbitControls />
    </Canvas>
  );
};

export default TechcrunchAura;
