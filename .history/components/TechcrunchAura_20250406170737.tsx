// components/TechcrunchAura.tsx
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

export default function TechcrunchAura() {
  return (
    <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl bg-white shadow-inner overflow-hidden">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={1.2} />
        <pointLight position={[10, 10, 10]} intensity={2} color={'#ff33cc'} />
        <group position={[0, 0, 0]}>
          <GlowingText />
          <MotionRings />
        </group>
        <EffectComposer>
          <Bloom luminanceThreshold={0} luminanceSmoothing={0.8} intensity={1.5} />
        </EffectComposer>
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
}

function GlowingText() {
  return (
    <Text
      position={[0, 0, 0]}
      fontSize={1.2}
      color="#d946ef"
      font="/fonts/helvetiker_bold.typeface.json"
      anchorX="center"
      anchorY="middle"
    >
      TECHCRUNCH
    </Text>
  );
}

function MotionRings() {
  const rings = [];
  for (let i = 0; i < 3; i++) {
    rings.push(
      <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2 + i * 0.3, 0.015, 16, 100]} />
        <meshBasicMaterial
          color={`hsl(${300 + i * 15}, 100%, 60%)`}
          transparent
          opacity={0.6 - i * 0.1}
        />
      </mesh>
    );
  }
  return <group>{rings}</group>;
}
