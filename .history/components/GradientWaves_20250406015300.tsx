import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const GradientWaves: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;

      // Create a scene, camera, and renderer
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ canvas });

      // Set size for the renderer (full screen)
      renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(renderer.domElement);

      // Create a simple geometry (plane) for the waves
      const geometry = new THREE.PlaneGeometry(5, 5, 32);
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
      const plane = new THREE.Mesh(geometry, material);
      scene.add(plane);

      // Position the camera away from the object
      camera.position.z = 5;

      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate);

        // Simple rotation animation to see the object
        plane.rotation.x += 0.01;
        plane.rotation.y += 0.01;

        // Render the scene with the camera
        renderer.render(scene, camera);
      };

      animate(); // Start the animation

      console.log('Three.js scene initialized');

      // Clean up on component unmount
      return () => {
        // Dispose of the Three.js scene properly
        scene.dispose();
        renderer.dispose();
      };
    }
  }, []);

  // Return a canvas element to render the Three.js scene
  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />;
};

export default GradientWaves;
