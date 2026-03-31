"use client";
import { Canvas, useFrame, extend } from "@react-three/fiber";
import { OrbitControls, Text3D, Trail, Float } from "@react-three/drei";
import * as THREE from "three";
import { useRef, useMemo, useState } from "react";

// Add font import
const helvetiker = require("three/examples/fonts/helvetiker_bold.typeface.json");

function PulsingNucleus() {
  const coreRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const scale = 1 + Math.sin(t * 3) * 0.1;
    if (coreRef.current) {
      coreRef.current.scale.set(scale, scale, scale);
      coreRef.current.rotation.y = t * 0.2;
      coreRef.current.rotation.z = t * 0.1;
      coreRef.current.material.emissiveIntensity = 0.5 + Math.sin(t * 4) * 0.3;
    }
    if (glowRef.current) {
      glowRef.current.scale.set(1.2 + Math.sin(t * 2) * 0.1, 1.2 + Math.sin(t * 2) * 0.1, 1.2 + Math.sin(t * 2) * 0.1);
      glowRef.current.material.opacity = 0.3 + Math.sin(t * 3) * 0.1;
    }
  });

  return (
    <group>
      <mesh ref={coreRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          color="#5E00FF" // Darker purple
          emissive="#5E00FF"
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      <mesh ref={glowRef}>
        <sphereGeometry args={[1.3, 32, 32]} />
        <meshBasicMaterial
          color="#5E00FF"
          transparent
          opacity={0.3}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

function OrbitingElectron({ angleOffset = 0, tilt = 0, speed = 1, orbitRadius = 4, size = 0.2, color = "#0077FF" }) {
  const electronRef = useRef<THREE.Mesh>(null);
  const trailRef = useRef<any>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed;
    const r = orbitRadius;
    const angle = t + angleOffset;
    const wobble = Math.sin(t * 3 + angleOffset) * 0.3;
    const x = Math.cos(angle) * r;
    const z = Math.sin(angle) * r;
    const y = wobble;
    
    if (electronRef.current) {
      const position = new THREE.Vector3(x, y, z);
      position.applyAxisAngle(new THREE.Vector3(1, 0, 0), tilt);
      electronRef.current.position.set(position.x, position.y, position.z);
      
      const pulse = 1 + Math.sin(t * 10) * 0.2;
      electronRef.current.scale.set(pulse, pulse, pulse);
      electronRef.current.material.emissiveIntensity = 0.8 + Math.sin(t * 15) * 0.3;
    }
  });

  return (
    <Trail
      width={0.8}
      length={6}
      color={color}
      attenuation={(width) => width * 0.2}
      ref={trailRef}
    >
      <mesh ref={electronRef}>
        <sphereGeometry args={[size, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.8}
          metalness={0.6}
          roughness={0.1}
        />
      </mesh>
    </Trail>
  );
}

function OrbitRing({ tilt = 0, radius = 4, color = "#0077FF", pulseSpeed = 1 }) {
  const ringRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.1;
      ringRef.current.material.opacity = 0.2 + Math.sin(t * pulseSpeed) * 0.05;
    }
  });
  
  return (
    <mesh rotation={[tilt, 0, 0]} ref={ringRef}>
      <ringGeometry args={[radius - 0.05, radius + 0.05, 128]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.2}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function FloatingParticles({ count = 50, radius = 6 }) {
  const particlesRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const r = radius * (0.7 + Math.random() * 0.3);
      
      temp.push({
        position: new THREE.Vector3(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta),
          r * Math.cos(phi)
        ),
        scale: 0.02 + Math.random() * 0.04,
        speed: 0.2 + Math.random() * 0.5,
        offset: Math.random() * Math.PI * 2
      });
    }
    return temp;
  }, [count, radius]);

  useFrame(({ clock }) => {
    if (!particlesRef.current) return;
    
    const t = clock.getElapsedTime();
    
    particles.forEach((particle, i) => {
      const { position, scale, speed, offset } = particle;
      
      const newPos = position.clone();
      newPos.x += Math.sin(t * speed + offset) * 0.1;
      newPos.y += Math.cos(t * speed + offset * 2) * 0.1;
      newPos.z += Math.sin(t * speed + offset * 3) * 0.1;
      
      const pulseScale = scale * (1 + Math.sin(t * 2 + offset) * 0.2);
      
      dummy.position.copy(newPos);
      dummy.scale.set(pulseScale, pulseScale, pulseScale);
      dummy.updateMatrix();
      
      particlesRef.current.setMatrixAt(i, dummy.matrix);
    });
    
    particlesRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={particlesRef} args={[null, null, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color="#0077FF" transparent opacity={0.4} />
    </instancedMesh>
  );
}

function FixedTechcrunchText() {
  return (
    <group position={[0, 0, 0]}>
      <Text3D
        font={helvetiker}
        size={0.8}
        height={0.2}
        bevelEnabled
        bevelSize={0.02}
        bevelThickness={0.05}
        position={[-3.5, -0.5, 0]} // Centered position
      >
        TECHCRUNCH
        <meshStandardMaterial
          attach="material"
          color="#5E00FF" // Dark purple
          metalness={0.9}
          roughness={0.1}
        />
      </Text3D>
    </group>
  );
}

export default function LightThemeAtomicScene() {
  const [orbitalConfig] = useState(() => {
    const electronColors = [
      "#0077FF", "#0066EE", "#0055DD", "#0044CC",
      "#0033BB", "#0022AA", "#001199", "#000088"
    ];
    
    const electrons = Array.from({ length: 8 }, (_, i) => ({
      angleOffset: (Math.PI * 2 * i) / 8,
      tilt: (Math.PI / 8) * i,
      speed: 1.5 + Math.random() * 1.5,
      orbitRadius: 3 + (i % 3) * 0.7,
      size: 0.12 + (i % 3) * 0.05,
      color: electronColors[i % electronColors.length]
    }));
    
    const rings = [
      { tilt: 0, radius: 3.5, color: "#0077FF", pulseSpeed: 1.2 },
      { tilt: Math.PI / 4, radius: 4, color: "#0066EE", pulseSpeed: 0.8 },
      { tilt: Math.PI / 6, radius: 3.7, color: "#0055DD", pulseSpeed: 1.5 }
    ];
    
    return { electrons, rings };
  });

  return (
    <div className="w-full h-screen bg-white"> {/* White background */}
      <Canvas shadows camera={{ position: [0, 0, 12], fov: 45 }}>
        <color attach="background" args={["#FFFFFF"]} /> {/* White canvas background */}
        
        {/* Lights - adjusted for light theme */}
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#5E00FF" />
        <pointLight position={[-10, -10, -10]} intensity={0.8} color="#0077FF" />
        
        <OrbitControls 
          enableZoom={true} 
          enablePan={true}
          enableRotate={true}
          autoRotate={true}
          autoRotateSpeed={0.5}
        />
        
        {/* Core elements */}
        <PulsingNucleus />
        
        {/* Electrons */}
        {orbitalConfig.electrons.map((config, i) => (
          <OrbitingElectron key={i} {...config} />
        ))}
        
        {/* Orbital rings */}
        {orbitalConfig.rings.map((config, i) => (
          <OrbitRing key={i} {...config} />
        ))}
        
        {/* Background particles */}
        <FloatingParticles count={70} radius={8} />
        
        {/* Fixed centered text */}
        <FixedTechcrunchText />
      </Canvas>
    </div>
  );
}