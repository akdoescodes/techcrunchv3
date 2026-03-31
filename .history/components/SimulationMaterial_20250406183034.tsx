// SimulationMaterial.tsx
import { extend } from '@react-three/fiber';
import * as THREE from 'three';

// Define the custom material class extending THREE.ShaderMaterial
class SimulationMaterial extends THREE.ShaderMaterial {
  constructor(size: number) {
    super({
      vertexShader: `
        // Your vertex shader code here
      `,
      fragmentShader: `
        // Your fragment shader code here
      `,
      uniforms: {
        uTime: { value: 0 },
        uPositions: { value: null },
        uSize: { value: size },
      },
    });
  }
}

// Extend the SimulationMaterial so it can be used in JSX
extend({ SimulationMaterial });

export default SimulationMaterial;
