// Scene.tsx
'use client';  // This should be at the top
import './Scene.css'
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Box } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

const Cube = () => {
  useFrame(() => {
    // Rotate the cube every frame
    console.log('Rendering frame');
  });

  return (
    <Box position={[-1.2, 0, 0]}>
      <meshStandardMaterial color="orange" />
    </Box>
  );
};

const Scene = () => {
  return (
    <Canvas>
      <ambientLight />
      <spotLight position={[10, 10, 10]} angle={0.15} />
      <Cube />
    </Canvas>
  );
};

export default Scene;
