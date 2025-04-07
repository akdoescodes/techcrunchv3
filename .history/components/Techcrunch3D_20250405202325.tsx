"use client";

import { Canvas, useFrame, extend } from "@react-three/fiber";
import { OrbitControls, Text3D, Trail, useTexture, Float } from "@react-three/drei";
import * as THREE from "three";
import { useRef, useMemo, useState, useEffect } from "react";

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
      coreRef.current.material.emissiveIntensity = 1.5 + Math.sin(t * 4) * 0.5;
    }
    if (glowRef.current) {
      glowRef.current.scale.set(1.2 + Math.sin(t * 2) * 0.1, 1.2 + Math.sin(t * 2) * 0.1, 1.2 + Math.sin(t * 2) * 0.1);
      glowRef.current.material.opacity = 0.6 + Math.sin(t * 3) * 0.2;
    }
  });

  return (
    <group>
      <mesh ref={coreRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          color="#9000FF"
          emissive="#8000FF"
          emissiveIntensity={1.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      <mesh ref={glowRef}>
        <sphereGeometry args={[1.3, 32, 32]} />
        <meshBasicMaterial
          color="#B066FF"
          transparent
          opacity={0.6}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Inner nucleus particles */}
      <NucleusParticles count={20} radius={0.7} />
    </group>
  );
}

function NucleusParticles({ count, radius }) {
  const particlesRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const positions = useMemo(() => {
    const pos = [];
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const r = radius * (0.5 + Math.random() * 0.5);
      
      pos.push({
        x: r * Math.sin(phi) * Math.cos(theta),
        y: r * Math.sin(phi) * Math.sin(theta),
        z: r * Math.cos(phi),
        scale: 0.05 + Math.random() * 0.1,
        speed: 0.5 + Math.random() * 1.5
      });
    }
    return pos;
  }, [count, radius]);

  useFrame(({ clock }) => {
    if (!particlesRef.current) return;
    
    const t = clock.getElapsedTime();
    
    positions.forEach((p, i) => {
      // Add some movement to each particle
      const angle = t * p.speed;
      const x = p.x * Math.cos(angle) - p.z * Math.sin(angle);
      const z = p.z * Math.cos(angle) + p.x * Math.sin(angle);
      
      dummy.position.set(x, p.y, z);
      dummy.scale.set(p.scale, p.scale, p.scale);
      dummy.updateMatrix();
      particlesRef.current.setMatrixAt(i, dummy.matrix);
    });
    
    particlesRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={particlesRef} args={[null, null, count]}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial
        color="#FF00FF"
        emissive="#FF00FF"
        emissiveIntensity={2}
      />
    </instancedMesh>
  );
}

function OrbitingElectron({ angleOffset = 0, tilt = 0, speed = 1, orbitRadius = 4, size = 0.2, color = "#00FF88" }) {
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
      
      // Add pulse effect to the electron
      const pulse = 1 + Math.sin(t * 10) * 0.2;
      electronRef.current.scale.set(pulse, pulse, pulse);
      electronRef.current.material.emissiveIntensity = 1.5 + Math.sin(t * 15) * 0.5;
    }
  });

  return (
    <Trail
      width={1.5}
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
          emissiveIntensity={2}
          metalness={0.6}
          roughness={0.1}
        />
      </mesh>
    </Trail>
  );
}

function OrbitRing({ tilt = 0, radius = 4, color = "#00FFFF", pulseSpeed = 1 }) {
  const ringRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.1;
      ringRef.current.material.opacity = 0.3 + Math.sin(t * pulseSpeed) * 0.1;
    }
  });
  
  return (
    <mesh rotation={[tilt, 0, 0]} ref={ringRef}>
      <ringGeometry args={[radius - 0.05, radius + 0.05, 128]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.3}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function EnergyField() {
  const fieldRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (fieldRef.current) {
      fieldRef.current.rotation.x = t * 0.05;
      fieldRef.current.rotation.y = t * 0.07;
      fieldRef.current.rotation.z = t * 0.03;
      fieldRef.current.material.opacity = 0.15 + Math.sin(t) * 0.05;
    }
  });
  
  return (
    <mesh ref={fieldRef}>
      <sphereGeometry args={[7, 32, 32]} />
      <meshBasicMaterial
        color="#6633FF"
        wireframe
        transparent
        opacity={0.2}
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
      
      // Animate particles in a slight orbital drift
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
      <meshBasicMaterial color="#AADDFF" transparent opacity={0.6} />
    </instancedMesh>
  );
}

function TechcrunchText() {
  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <Text3D
        font={helvetiker}
        size={0.6}
        height={0.2}
        bevelEnabled
        bevelSize={0.02}
        bevelThickness={0.05}
        position={[-3.3, -3, 0]}
      >
        TECHCRUNCH
        <meshStandardMaterial
          attach="material"
          color="#8000FF"
          emissive="#8000FF"
          emissiveIntensity={2}
          metalness={1}
          roughness={0.1}
        />
      </Text3D>
    </Float>
  );
}

export default function CinematicAtomicScene() {
  // State for random orbit parameters to make each component unique
  const [orbitalConfig] = useState(() => {
    const electronColors = [
      "#00FF88", "#00FFFF", "#33CCFF", "#55AAFF", 
      "#77FFAA", "#AAFFDD", "#66DDFF", "#88EEFF"
    ];
    
    // Generate configuration for 8 electrons
    const electrons = Array.from({ length: 8 }, (_, i) => ({
      angleOffset: (Math.PI * 2 * i) / 8,
      tilt: (Math.PI / 8) * i,
      speed: 1.5 + Math.random() * 1.5,
      orbitRadius: 3 + (i % 3) * 0.7,
      size: 0.12 + (i % 3) * 0.05,
      color: electronColors[i % electronColors.length]
    }));
    
    // Generate configuration for 3 orbital rings
    const rings = [
      { tilt: 0, radius: 3.5, color: "#00FFFF", pulseSpeed: 1.2 },
      { tilt: Math.PI / 4, radius: 4, color: "#33CCFF", pulseSpeed: 0.8 },
      { tilt: Math.PI / 6, radius: 3.7, color: "#55AAFF", pulseSpeed: 1.5 }
    ];
    
    return { electrons, rings };
  });

  return (
    <div className="w-full h-screen bg-black">
      <Canvas shadows camera={{ position: [0, 0, 12], fov: 45 }}>
        <color attach="background" args={["#000000"]} />
        
        {/* Lights */}
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#8000FF" />
        <pointLight position={[-10, -10, -10]} intensity={0.8} color="#00FF88" />
        <spotLight position={[0, 10, 0]} intensity={0.5} color="#FFFFFF" />
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          enableRotate={true}
          autoRotate={true}
          autoRotateSpeed={0.5}
        />
        
        {/* Core elements */}
        <PulsingNucleus />
        
        {/* Energy field */}
        <EnergyField />
        
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
        
        {/* Text */}
        <TechcrunchText />
      </Canvas>
    </div>
  );
}