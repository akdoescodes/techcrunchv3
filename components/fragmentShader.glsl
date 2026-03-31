// fragmentShader.glsl
uniform sampler2D uPositions;
uniform float uTime;

void main() {
  gl_FragColor = texture2D(uPositions, gl_FragCoord.xy);
}
