import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { SphereBufferGeometry, MeshStandardMaterial } from 'three';  // Import SphereBufferGeometry and MeshStandardMaterial from three
import SimulationMaterial from './SimulationMaterial';  // Your custom shader material

const TechcrunchAura = () => {
  const [time, setTime] = useState(0);  // To control time for animation or simulation
  const sphereRef = useRef(null);  // Ref to the mesh for rotation control

  // Use the useFrame hook to update time on every frame
  useFrame(() => {
    setTime((prevTime) => prevTime + 0.05);  // Increment time on each frame (for animation)
    if (sphereRef.current) {
      sphereRef.current.rotation.y += 0.01;  // Rotate the sphere mesh around Y axis
    }
  });

  return (
    <Canvas>
      {/* Optional lighting for better visuals */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      
      <mesh ref={sphereRef}>
        {/* SphereBufferGeometry with radius 1 and 32 segments */}
        <SphereBufferGeometry args={[1, 32, 32]} />
        
        {/* Use SimulationMaterial for custom shader effect */}
        <SimulationMaterial size={32} />
      </mesh>
    </Canvas>
  );
};

export default TechcrunchAura;
