import { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  varying vec2 vUv;

  void main() {
    vec3 color = vec3(0.5 + 0.5 * cos(uTime + vUv.x * 10.0), 
                      0.5 + 0.5 * cos(uTime + vUv.y * 10.0), 
                      0.5 + 0.5 * cos(uTime + vUv.x * 5.0));
    gl_FragColor = vec4(color, 1.0);
  }
`;

const AnimatedBackground: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const clock = new THREE.Clock();

  useEffect(() => {
    const animate = () => {
      if (meshRef.current) {
        // Cast the material to ShaderMaterial to access 'uniforms'
        const material = meshRef.current.material as THREE.ShaderMaterial;
        material.uniforms.uTime.value = clock.getElapsedTime();
      }
      requestAnimationFrame(animate);
    };
    animate();
  }, []);

  return (
    <mesh ref={meshRef} position={[0, 0, -1]}>
      <planeGeometry args={[5, 5]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTime: { value: 0 },
        }}
      />
    </mesh>
  );
};

const Home: React.FC = () => {
  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      <Canvas 
        style={{
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          zIndex: 80,  // Ensure this is above other elements
        }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <AnimatedBackground />
      </Canvas>
      <div 
        style={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)', 
          zIndex: 20,  // Optional: set this higher than the canvas
        }}
      >
        <h1 style={{ color: '#fff', fontSize: '2rem' }}>Welcome to the Event Page</h1>
      </div>
    </div>
  );
};

export default Home;
