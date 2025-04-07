import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import * as THREE from "three";
import { Canvas, useFrame, extend, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

extend({ OrbitControls });

// Utility Class: Ring
class Ring {
  constructor({ radius, count, speed, color }) {
    this.radius = radius;
    this.count = count;
    this.speed = speed;
    this.color = color;
    this.particles = [];

    this.geometry = new THREE.SphereGeometry(0.05, 16, 16);
    this.material = new THREE.MeshBasicMaterial({ color: this.color });

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * 2 * Math.PI;
      const particle = new THREE.Mesh(this.geometry, this.material);
      particle.position.set(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        0
      );
      this.particles.push(particle);
    }
  }

  addToScene(scene) {
    this.particles.forEach((p) => scene.add(p));
  }

  update(delta) {
    this.particles.forEach((p, i) => {
      const angle = (i / this.count) * 2 * Math.PI + delta * this.speed;
      p.position.set(
        Math.cos(angle) * this.radius,
        Math.sin(angle) * this.radius,
        0
      );
    });
  }
}

// Inner Canvas for Techcrunch 3D
const Techcrunch3D = () => {
  const groupRef = useRef();
  const { scene } = useThree();

  useEffect(() => {
    const ring1 = new Ring({ radius: 1.5, count: 50, speed: 1, color: "#f0f" });
    const ring2 = new Ring({ radius: 2, count: 80, speed: -0.5, color: "#0ff" });
    ring1.addToScene(scene);
    ring2.addToScene(scene);

    const rings = [ring1, ring2];

    useFrame((state, delta) => {
      rings.forEach((ring) => ring.update(state.clock.getElapsedTime()));
    });
  }, [scene]);

  return (
    <group ref={groupRef}>
      {/* Tesseract or other complex 3D visuals will go here */}
    </group>
  );
};

// Main Component
const TerminalWithTechcrunch = () => {
  return (
    <div className="w-full h-screen bg-black text-white p-4">
      <div className="max-w-5xl mx-auto h-full flex flex-col justify-center">
        <motion.div
          className="rounded-xl bg-black/30 backdrop-blur-md border border-white/10 p-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-4xl font-bold mb-4 flex justify-center space-x-2">
            {"TECHCRUNCH".split("").map((char, idx) => (
              <span key={idx} className="inline-block">
                {char}
              </span>
            ))}
          </div>

          <div className="w-full h-[400px] rounded-xl overflow-hidden border border-white/10">
            <Canvas camera={{ position: [0, 0, 5], fov: 70 }}>
              <ambientLight intensity={0.3} />
              <pointLight position={[10, 10, 10]} />
              <Techcrunch3D />
              <OrbitControls enableZoom={false} enablePan={false} />
            </Canvas>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TerminalWithTechcrunch;
