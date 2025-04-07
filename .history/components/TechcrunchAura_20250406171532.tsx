// components/TechcrunchAura.tsx
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

export default function TechcrunchAura() {
  return (
    <Canvas
      className="fixed inset-0 z-[-1] pointer-events-none"
      camera={{ position: [0, 0, 8], fov: 75 }}
      gl={{ alpha: true }}
    >
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1.2} />
      <NeuronWeb count={60} />
    </Canvas>
  );
}

function NeuronWeb({ count = 60 }) {
  const group = useRef<THREE.Group>(null);

  const neurons = useMemo(() => {
    const nodes = [];
    for (let i = 0; i < count; i++) {
      const position = new THREE.Vector3(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 5
      );
      nodes.push(position);
    }
    return nodes;
  }, [count]);

  useFrame(() => {
    if (group.current) group.current.rotation.y += 0.001;
  });

  return (
    <group ref={group}>
      {neurons.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshBasicMaterial color="#d946ef" transparent opacity={0.8} />
        </mesh>
      ))}

      {/* Lines connecting close neurons */}
      {neurons.flatMap((a, i) =>
        neurons.map((b, j) => {
          if (i < j && a.distanceTo(b) < 2) {
            const points = [a, b];
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            return (
              <line key={`${i}-${j}`} geometry={geometry}>
                <lineBasicMaterial color="#c084fc" linewidth={0.4} transparent opacity={0.3} />
              </line>
            );
          }
          return null;
        })
      )}
    </group>
  );
}
