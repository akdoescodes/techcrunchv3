void main() {
  float d = length(gl_PointCoord - vec2(0.5));
  if (d > 0.5) discard;
  gl_FragColor = vec4(0.8, 0.3, 1.0, 1.0); // Purple-pink glow
}
    