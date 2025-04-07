import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text3D, Center, Float } from '@react-three/drei';
import * as THREE from 'three';
import helvetiker from 'three/examples/fonts/helvetiker_bold.typeface.json';

function FloatingSquare({ position, speed }: { position: [number, number, number]; speed: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.rotation.x += 0.005;
      const time = clock.getElapsedTime();
      meshRef.current.position.y = position[1] + Math.sin(time * speed) * 0.05;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[0.05, 0.05, 0.05]} />
      <meshStandardMaterial color={'#a855f7'} emissive={'#a855f7'} emissiveIntensity={0.5} roughness={0.2} metalness={0.8} />
    </mesh>
  );
}

function FloatingSquares({ count = 100 }) {
  const positions = useMemo(() => {
    const pos = [];
    for (let i = 0; i < count; i++) {
      pos.push([
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 10,
      ]);
    }
    return pos;
  }, [count]);

  return (
    <>
      {positions.map((pos, i) => (
        <FloatingSquare key={i} position={pos as [number, number, number]} speed={Math.random() * 2 + 0.5} />
      ))}
    </>
  );
}

function Techcrunch3DText() {
  return (
    <Center>
      <Float floatIntensity={1.2} rotationIntensity={0.3}>
        <Text3D
          font={helvetiker}
          size={1}
          height={0.2}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.02}
          bevelSegments={5}
        >
          TECHCRUNCH
          <meshStandardMaterial>
            <shaderMaterial 
              attach="material"
              args={[{
                uniforms: {
                  color1: { value: new THREE.Color('#a855f7') },
                  color2: { value: new THREE.Color('#ec4899') }
                },
                vertexShader: `
                  varying vec2 vUv;
                  void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                  }
                `,
                fragmentShader: `
                  uniform vec3 color1;
                  uniform vec3 color2;
                  varying vec2 vUv;
                  void main() {
                    gl_FragColor = vec4(mix(color1, color2, vUv.y), 1.0);
                  }
                `,
              }]}
            />
          </meshStandardMaterial>
        </Text3D>
      </Float>
    </Center>
  );
}

export default function Techcrunch3D() {
  return (
    <div className="w-full h-[100vh] bg-black">
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <ambientLight intensity={1.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <FloatingSquares count={150} />
        <Techcrunch3DText />
      </Canvas>
    </div>
  );
}