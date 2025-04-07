"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { Line2 } from "three/examples/jsm/lines/Line2";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial";

const wireConfigs = [
  { points: [[-1, -1, 0], [0, 0, 0]], colors: ["#8B5CF6", "#EC4899", "#7E22CE"], width: 2 },
  { points: [[1, -1, 0], [0, 0, 0]], colors: ["#7C3AED", "#DB2777", "#6B21A8"], width: 3 },
  { points: [[-1, 1, 0], [0, 0, 0]], colors: ["#A78BFA", "#F472B6", "#9333EA"], width: 2 },
  { points: [[1, 1, 0], [0, 0, 0]], colors: ["#6D28D9", "#BE185D", "#86198F"], width: 3 },
  { points: [[0, -1.5, 0], [0, 0, 0]], colors: ["#C4B5FD", "#F9A8D4", "#A855F7"], width: 4 }
];

const Wire = ({ points, colors, width }: any) => {
  const lineRef = useRef<Line2>(null!);

  const geometry = useMemo(() => {
    const lineGeo = new LineGeometry();
    const flattened = points.flat();
    lineGeo.setPositions(flattened);
    return lineGeo;
  }, [points]);

  const material = useMemo(() => {
    const mat = new LineMaterial({
      linewidth: width,
      vertexColors: false,
      color: new THREE.Color(colors[1]),
      dashed: true,
      dashSize: 0.2,
      gapSize: 0.3,
    });
    mat.resolution.set(window.innerWidth, window.innerHeight);
    return mat;
  }, [colors, width]);

  useFrame(({ clock }) => {
    material.dashOffset -= 0.01;
  });

  return <primitive object={new Line2(geometry, material)} />;
};

const EnergyCore = () => {
  const meshRef = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    const s = 1 + 0.3 * Math.sin(clock.getElapsedTime() * 2);
    meshRef.current.scale.set(s, s, s);
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
    <div className="absolute inset-0 -z-10 pointer-events-none">
      <Canvas orthographic camera={{ zoom: 100, position: [0, 0, 10] }}>
        {wireConfigs.map((wire, i) => (
          <Wire key={i} {...wire} />
        ))}
        <EnergyCore />
      </Canvas>
    </div>
  );
};
i