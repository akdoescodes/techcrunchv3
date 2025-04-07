import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';
import vertexShader from './vertexShader.glsl';
import fragmentShader from './fragmentShader.glsl';

const SimulationMaterial = shaderMaterial(
  { uTime: 0 },
  vertexShader,
  fragmentShader
);

export default SimulationMaterial;
