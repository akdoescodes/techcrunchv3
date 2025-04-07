// components/TechcrunchAura.tsx
import { Canvas, useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useRef, useMemo } from 'react';

const codeIcons = ['</>', '{}', '()', 'const', 'let', '<>', '=>', '&&', '||'];

export default function TechcrunchAura() {
  return (
    <Canvas
      className="fixed inset-0 z-[-1] pointer-events-none"
      camera={{ position: [0, 0, 6], fov: 75 }}
      gl={{ alpha: true }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <FloatingIcons count={150} />
    </Canvas>
  );
}

function FloatingIcons({ count = 150 }) {
  const group = useRef<THREE.Group>(null);

  const icons = useMemo(() => {
    const iconData = [];
    for (let i = 0; i < count; i++) {
      const icon = codeIcons[Math.floor(Math.random() * codeIcons.length)];
      const position = new THREE.Vector3(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 5
      );
      const rotationSpeed = Math.random() * 0.01 + 0.002;
      iconData.push({ icon, position, rotationSpeed });
    }
    return iconData;
  }, [count]);

  useFrame(() => {
    if (group.current) {
      group.current.rotation.y += 0.001;
    }
  });

  return (
    <group ref={group}>
      {icons.map((item, i) => (
        <Text
          key={i}
          position={item.position}
          fontSize={0.25}
          color="#d946ef"
          anchorX="center"
          anchorY="middle"
          font="/fonts/helvetiker_bold.typeface.json"
        >
          {item.icon}
        </Text>
      ))}
    </group>
  );
}
