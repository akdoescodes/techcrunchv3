'use client';

import { Canvas, useFrame, createPortal, extend } from '@react-three/fiber';
import { OrbitControls, useFBO } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import SimulationMaterial from './SimulationMaterial';

import vertexShader from '!!raw-loader!./vertexShader.glsl';
import fragmentShader from '!!raw-loader!./fragmentShader.glsl';

extend({ SimulationMaterial });

function FBOParticles() {
  const size = 128;
  const points = useRef();
  const simulationMaterialRef = useRef();

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1 / Math.pow(2, 53), 1);
  const positions = new Float32Array([-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, 1, 1, 0, -1, 1, 0]);
  const uvs = new Float32Array([0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1]);

  const renderTarget = useFBO(size, size, {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat,
    type: THREE.FloatType,
  });

  const particlesPosition = useMemo(() => {
    const particles = new Float32Array(size * size * 3);
    for (let i = 0; i < size * size; i++) {
      let i3 = i * 3;
      particles[i3 + 0] = (i % size) / size;
      particles[i3 + 1] = Math.floor(i / size) / size;
    }
    return particles;
  }, [size]);

  const uniforms = useMemo(() => ({
    uPositions: { value: null },
  }), []);

  useFrame((state) => {
    const { gl, clock } = state;

    gl.setRenderTarget(renderTarget);
    gl.clear();
    gl.render(scene, camera);
    gl.setRenderTarget(null);

    if (points.current?.material?.uniforms) {
      points.current.material.uniforms.uPositions.value = renderTarget.texture;
    }

    if (simulationMaterialRef.current?.uniforms?.uTime) {
      simulationMaterialRef.current.uniforms.uTime.value = clock.elapsedTime;
    }
  });

  return (
    <>
      {createPortal(
        <mesh>
          <simulationMaterial ref={simulationMaterialRef} args={[size]} />
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" array={positions} itemSize={3} />
            <bufferAttribute attach="attributes-uv" array={uvs} itemSize={2} />
          </bufferGeometry>
        </mesh>,
        scene
      )}
      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particlesPosition.length / 3}
            array={particlesPosition}
            itemSize={3}
          />
        </bufferGeometry>
        <shaderMaterial
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          fragmentShader={fragmentShader}
          vertexShader={vertexShader}
          uniforms={uniforms}
          transparent
        />
      </points>
    </>
  );
}

export default function TechcrunchAura() {
  return (
    <Canvas camera={{ position: [0, 0, 2.5] }}>
      <ambientLight intensity={0.5} />
      <FBOParticles />
      <OrbitControls enableZoom={false} enablePan={false} />
    </Canvas>
  );
}
