"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { Line2, LineMaterial, LineGeometry } from "three-stdlib";

const wireConfigs = [
  { points: [[-1, -1, 0], [0, 0, 0]], color: "#8B5CF6", width: 2 },
  { points: [[1, -1, 0], [0, 0, 0]], color: "#7C3AED", width: 3 },
  { points: [[-1, 1, 0], [0, 0, 0]], color: "#A78BFA", width: 2 },
  { points: [[1, 1, 0], [0, 0, 0]], color: "#6D28D9", width: 3 },
  { points: [[0, -1.5, 0], [0, 0, 0]], color: "#C4B5FD", width: 4 }
];

interface WireProps {
  points: number[][];
  color: string;
  width: number;
}

const Wire = ({ points, color, width }: WireProps) => {
  const materialRef = useRef<LineMaterial>(null!);

  const geometry = useMemo(() => {
    const geo = new LineGeometry();
    geo.setPositions(points.flat());
    return geo;
  }, [points]);

  const material = useMemo(() => {
    const mat = new LineMaterial({
      color: new THREE.Color(color),
      linewidth: width,
      dashed: true,
      dashSize: 0.2,
      gapSize: 0.3,
    });
    mat.resolution.set(window.innerWidth, window.innerHeight);
    return mat;
  }, [color, width]);

  useFrame(() => {
    material.dashOffset -= 0.01;
  });

  return <primitive object={new Line2(geometry, material)} />;
};

const EnergyCore = () => {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const scale = 1 + 0.3 * Math.sin(clock.getElapsedTime() * 2);
    meshRef.current.scale.set(scale, scale, scale);
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.05, 32, 32]} />
      <meshBasicMaterial color="#A855F7" />
    </mesh>
  );
};

export const PowerWiresAnimation = () => {
  return (
    <div className="absolute inset-0 pointer-events-none z-10"> {/* z-10 or higher */}
      <Canvas orthographic camera={{ zoom: 100, position: [0, 0, 10] }}>
        {wireConfigs.map((wire, i) => (
          <Wire key={i} {...wire} />
        ))}
        <EnergyCore />
      </Canvas>
    </div>
  );
};
