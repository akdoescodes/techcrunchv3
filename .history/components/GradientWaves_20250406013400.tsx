import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const GradientWaves: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Set up scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Custom GLSL Shader Code
    const vertexShader = `
      varying vec2 vUv;

      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      varying vec2 vUv;
      uniform float time;

      void main() {
        float wave = sin(vUv.x * 10.0 + time) * 0.5 + 0.5;
        vec3 color = mix(vec3(0.2, 0.2, 0.5), vec3(0.8, 0.2, 0.2), wave);
        gl_FragColor = vec4(color, 1.0);
      }
    `;

    // Create shader material
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
      },
      vertexShader,
      fragmentShader,
    });

    // Create a plane geometry to apply the shader
    const geometry = new THREE.PlaneGeometry(2, 2);
    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    camera.position.z = 1;

    // Animation loop
    const animate = () => {
      material.uniforms.time.value += 0.05; // Change wave effect over time
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    // Start animation
    animate();

    // Handle window resize
    const onWindowResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', onWindowResize);

    return () => {
      window.removeEventListener('resize', onWindowResize);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-white">
      {/* Canvas for waves */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 z-0"
        style={{ pointerEvents: 'none' }} // Prevent interaction with the canvas
      ></canvas>

      {/* Your other content, such as the terminal */}
      <div className="relative z-10 text-white text-center py-10">
        <h1 className="text-3xl font-bold">My Cool Terminal</h1>
        {/* Add any additional content you need here */}
      </div>
    </div>
  );
};

export default GradientWaves;
