// Scene.tsx
import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import FBOParticles from './FBOParticles';


const Scene = () => {
  return (
    <Canvas camera={{ position: [1.5, 1.5, 2.5] }}>
      <ambientLight intensity={0.5} />
      <FBOParticles />
      <OrbitControls />
    </Canvas>
  );
};

export default Scene;
