"use client"

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text3D } from "@react-three/drei";
import * as THREE from "three";
import { useRef } from "react";

const helvetiker = require("three/examples/fonts/helvetiker_bold.typeface.json");

function TesseractFrame() {
  const group = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (group.current) {
      group.current.rotation.x = clock.getElapsedTime() * 0.3;
      group.current.rotation.y = clock.getElapsedTime() * 0.4;
    }
  });

  const material = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#c084fc"),
    metalness: 0.8,
    roughness: 0.2,
    transparent: true,
    opacity: 0.25,
    transmission: 1,
    thickness: 0.5,
    emissive: new THREE.Color("#a855f7"),
    emissiveIntensity: 0.2,
  });

  const cubeSize = 4;
  const edges = [];
  const vertices = [
    [-1, -1, -1],
    [-1, -1, 1],
    [-1, 1, -1],
    [-1, 1, 1],
    [1, -1, -1],
    [1, -1, 1],
    [1, 1, -1],
    [1, 1, 1],
  ];

  const connections = [
    [0, 1], [0, 2], [0, 4],
    [1, 3], [1, 5],
    [2, 3], [2, 6],
    [3, 7],
    [4, 5], [4, 6],
    [5, 7],
    [6, 7],
  ];

  return (
    <group ref={group}>
      {connections.map(([a, b], i) => {
        const start = new THREE.Vector3(...vertices[a]).multiplyScalar(cubeSize / 2);
        const end = new THREE.Vector3(...vertices[b]).multiplyScalar(cubeSize / 2);
        const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
        const dir = new THREE.Vector3().subVectors(end, start);
        const length = dir.length();
        const rotation = new THREE.Euler().setFromQuaternion(
          new THREE.Quaternion().setFromUnitVectors(
            new THREE.Vector3(0, 1, 0),
            dir.clone().normalize()
          )
        );
        return (
          <mesh key={i} position={mid} rotation={rotation}>
            <cylinderGeometry args={[0.02, 0.02, length, 8]} />
            <primitive object={material} attach="material" />
          </mesh>
        );
      })}
    </group>
  );
}

function TechCrunchText() {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (mesh.current) {
      mesh.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.4) * 0.3;
    }
  });

  return (
    <Text3D
      ref={mesh}
      font={helvetiker}
      size={0.5}
      height={0.1}
      position={[-2.5, 0, 0]}
      bevelEnabled
      bevelSize={0.01}
      bevelThickness={0.02}
    >
      TECHCRUNCH
      <meshStandardMaterial
        color="#ffffff"
        emissive="#9333ea"
        metalness={0.8}
        roughness={0.2}
      />
    </Text3D>
  );
}

export default function TesseractScene() {
  return (
    <div className="w-full h-screen bg-black">
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
        <color attach="background" args={["#0f0f1a"]} />
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={1} color="#d946ef" />

        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />

        <TesseractFrame />
        <TechCrunchText />
      </Canvas>
    </div>
  );
}