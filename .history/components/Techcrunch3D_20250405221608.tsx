"use client";
import { Canvas } from "@react-three/fiber";
import { Text3D, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useRef } from "react";

export default function TechCrunchText() {
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  return (
    <div className="w-full h-screen bg-black">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        gl={{ antialias: true }}
      >
        {/* Lights */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ffffff" />

        {/* Controls - allow user to rotate view */}
        <OrbitControls enableZoom={false} />

        {/* 3D Text with Gradient */}
        <Text3D
          font="/fonts/helvetiker_regular.typeface.json"
          size={0.8}
          height={0.2}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.02}
          bevelOffset={0}
          bevelSegments={5}
          position={[-3.5, 0, 0]}
        >
          TECHCRUNCH
          <meshStandardMaterial
            ref={materialRef}
            color="#ffffff"
            metalness={0.7}
            roughness={0.2}
            onBeforeCompile={(shader) => {
              shader.fragmentShader = `
                varying vec2 vUv;
                varying vec3 vViewPosition;
                ${shader.fragmentShader.replace(
                  '#include <output_fragment>',
                  `
                  // Create gradient from blue to purple
                  vec3 gradient = mix(
                    vec3(0.2, 0.5, 1.0), // Blue
                    vec3(1.0, 0.2, 0.8), // Purple
                    smoothstep(-1.0, 1.0, vViewPosition.y)
                  );
                  outgoingLight = outgoingLight * gradient;
                  #include <output_fragment>
                  `
                )}
              `;
            }}
          />
        </Text3D>
      </Canvas>
    </div>
  );
}