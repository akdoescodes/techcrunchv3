import * as THREE from 'three';
import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import SimulationMaterial from './SimulationMaterial'; // Adjust the path if needed

const TechcrunchAura = () => {
  const materialRef = useRef<THREE.ShaderMaterial>(null!);
  const [time, setTime] = useState(0);

  // Use the useFrame hook to update the time uniform on every frame
  useFrame(() => {
    setTime((prevTime) => prevTime + 0.05);
  });

  // Create the material with SimulationMaterial
  const simulationMaterial = useMemo(() => new SimulationMaterial(512), []);

  // Update the time uniform in the material every time it changes
  useEffect(() => {
    if (simulationMaterial) {
      simulationMaterial.uniforms.uTime.value = time;
    }
  }, [time, simulationMaterial]);

  return (
    <mesh>
      <sphereBufferGeometry args={[2, 32, 32]} />
      <primitive object={simulationMaterial} attach="material" />
    </mesh>
  );
};

export default TechcrunchAura;
npm ru