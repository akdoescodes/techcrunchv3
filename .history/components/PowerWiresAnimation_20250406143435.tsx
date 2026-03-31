// components/PowerWiresAnimation.tsx
"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { Line2, LineMaterial, LineGeometry } from "three-stdlib";

const generateWires = () => {
  const angles = Array.from({ length: 10 }, (_, i) => (i * Math.PI * 2) / 10);
  return angles.map((angle) => {
    const length = 2.5;
    const x = Math.cos(angle) * length;
    const y = Math.sin(angle) * length;
    return {
      points: [
        [0, 0, 0],
        [x, y, 0],
      ],
      width: 3,
    };
  });
};

const wireConfigs = generateWires();

const Wire = ({ points, width }: any) => {
  const lineRef = useRef<Line2>(null!);

  const geometry = useMemo(() => {
    const lineGeo = new LineGeometry();
    lineGeo.setPositions(points.flat());
    return lineGeo;
  }, [points]);

  const material = useMemo(() => {
    const mat = new LineMaterial({
      linewidth: width,
      vertexColors: false,
      transparent: true,
      opacity: 0.35,
      color: new THREE.Color("#ffffff"),
    });

    mat.resolution.set(window.innerWidth, window.innerHeight);
    mat.depthWrite = false;
    mat.transparent = true;
    mat.opacity = 0.35;
    mat.blending = THREE.AdditiveBlending;

    return mat;
  }, [width]);

  useFrame(({ clock }) => {
    material.dashOffset -= 0.005;
  });

  return <primitive object={new Line2(geometry, material)} />;
};

const EnergyCore = () => {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const s = 1 + 0.2 * Math.sin(t * 3);
    meshRef.current.scale.set(s, s, s);
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.05, 64, 64]} />
      <meshStandardMaterial
        color={"#ffffff"}
        emissive={"#A855F7"}
        transparent
        opacity={0.5}
        roughness={0.1}
        metalness={0.9}
      />
    </mesh>
  );
};

export const PowerWiresAnimation = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas
        orthographic
        camera={{ zoom: 100, position: [0, 0, 10] }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[0, 0, 2]} intensity={1.5} color="#A855F7" />
        {wireConfigs.map((wire, i) => (
          <Wire key={i} {...wire} />
        ))}
        <EnergyCore />
      </Canvas>
    </div>
  );
};
