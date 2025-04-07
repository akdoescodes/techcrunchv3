// components/TechcrunchAura.tsx
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

export default function TechcrunchAura() {
  return (
    <Canvas
      className="fixed inset-0 z-[-1] pointer-events-none"
      camera={{ position: [0, 0, 8], fov: 75 }}
      gl={{ alpha: true }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={2} color={'#f0f'} />
      <ElectronSystem />
    </Canvas>
  );
}

function ElectronSystem() {
  const nucleusRef = useRef<THREE.Mesh>(null);
  const electronRefs = useRef<THREE.Mesh[]>([]);
  const ringCount = 3;
  const electronsPerRing = 6;

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    electronRefs.current.forEach((electron, i) => {
      const ringIndex = Math.floor(i / electronsPerRing);
      const angle = (i % electronsPerRing) * ((Math.PI * 2) / electronsPerRing);
      const speed = 0.6 + ringIndex * 0.3;
      const radius = 1.5 + ringIndex * 0.8;

      const x = Math.cos(angle + time * speed) * radius;
      const y = Math.sin(angle + time * speed) * radius;
      const z = Math.sin(angle + time * speed * 0.6) * 0.4 * (ringIndex + 1);

      electron.position.set(x, y, z);
    });

    if (nucleusRef.current) {
      nucleusRef.current.rotation.y += 0.002;
    }
  });

  const electrons = Array.from({ length: ringCount * electronsPerRing });

  return (
    <group>
      {/* Nucleus */}
      <mesh ref={nucleusRef}>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshBasicMaterial color="#a855f7" />
      </mesh>

      {/* Electrons */}
      {electrons.map((_, i) => (
        <mesh key={i} ref={(ref) => (electronRefs.current[i] = ref!)}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshBasicMaterial color="#22d3ee" />
        </mesh>
      ))}
    </group>
  );
}
