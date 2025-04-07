import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import SimulationMaterial from './SimulationMaterial';

const TechcrunchAura = () => {
  const simRef = useRef<THREE.ShaderMaterial>(null!);

  useFrame(({ clock }) => {
    if (simRef.current) {
      simRef.current.uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  return (
    <mesh>
      <planeGeometry args={[5, 5]} />
      <simulationMaterial ref={simRef} />
    </mesh>
  );
};
