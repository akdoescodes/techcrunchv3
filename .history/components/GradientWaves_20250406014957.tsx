import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const GradientWaves: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ canvas });
      renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(renderer.domElement);

      const geometry = new THREE.PlaneGeometry(5, 5, 32);
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
      const plane = new THREE.Mesh(geometry, material);
      scene.add(plane);

      camera.position.z = 5;

      const animate = () => {
        requestAnimationFrame(animate);
        plane.rotation.x += 0.01;
        plane.rotation.y += 0.01;
        renderer.render(scene, camera);
      };

      animate();
    }

    return () => {
      // Cleanup the Three.js scene
    };
  }, []);

  return <canvas ref={canvasRef}></canvas>;
};

export default GradientWaves;
