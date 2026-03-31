import * as THREE from 'three';

class SimulationMaterial extends THREE.ShaderMaterial {
  constructor(size: number) {
    super({
      uniforms: {
        uTime: { value: 0 },
      },
      vertexShader: `
        void main() {
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        void main() {
          gl_FragColor = vec4(sin(uTime), cos(uTime), sin(uTime * 0.5), 1.0);
        }
      `,
    });
  }
}

export default SimulationMaterial;
