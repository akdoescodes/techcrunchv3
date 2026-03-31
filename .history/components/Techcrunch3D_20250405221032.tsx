"use client";
import { Canvas } from "@react-three/fiber";
import { Text3D, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

const TechCrunchText = () => {
  return (
    <div className="w-full h-screen bg-black">
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        <OrbitControls enableZoom={false} />
        
        {/* Gradient Text */}
        <Text3D
          font="/fonts/helvetiker_regular.typeface.json"
          size={1}
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
          {/* Gradient Material */}
          <meshStandardMaterial
            color="#ffffff"
            metalness={0.7}
            roughness={0.2}
            onBeforeCompile={(shader) => {
              // Add gradient effect
              shader.fragmentShader = shader.fragmentShader.replace(
                '#include <output_fragment>',
                `
                vec3 gradient = mix(
                  vec3(0.2, 0.5, 1.0), 
                  vec3(1.0, 0.2, 0.8), 
                  smoothstep(0.0, 1.0, vViewPosition.y / 5.0)
                );
                outgoingLight = outgoingLight * gradient;
                #include <output_fragment>
                `
              );
            }}
          />
        </Text3D>
      </Canvas>
    </div>
  );
};

export default TechCrunchText;