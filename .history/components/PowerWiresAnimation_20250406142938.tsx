const HelixWire = ({
    radius,
    turns,
    height,
    thickness,
    phaseOffset,
  }: {
    radius: number
    turns: number
    height: number
    thickness: number
    phaseOffset: number
  }) => {
    const tubeRef = useRef<THREE.Mesh>(null!)
  
    const path = useMemo(() => {
      const curve = new THREE.Curve<THREE.Vector3>()
      curve.getPoint = (t) => {
        const angle = 2 * Math.PI * turns * t + phaseOffset
        const x = radius * Math.cos(angle)
        const y = height * (t - 0.5)
        const z = radius * Math.sin(angle)
        return new THREE.Vector3(x, y, z)
      }
      return curve
    }, [radius, turns, height, phaseOffset])
  
    const geometry = useMemo(
      () => new THREE.TubeGeometry(path, 300, thickness, 64, false),
      [path, thickness]
    )
  
    const material = useMemo(
      () =>
        new THREE.MeshPhysicalMaterial({
          transparent: true,
          transmission: 1.0,         // Full glass transmission
          thickness: 0.6,            // Depth of refraction
          roughness: 0.05,           // Super smooth
          metalness: 0,
          ior: 1.45,                 // Realistic glass IOR
          reflectivity: 0.8,         // Strong reflection
          clearcoat: 1,
          clearcoatRoughness: 0.05,
          attenuationColor: new THREE.Color(0xffffff),
          attenuationDistance: 0.8,
          side: THREE.DoubleSide
        }),
      []
    )
  
    useFrame(({ clock }) => {
      tubeRef.current.rotation.y = clock.getElapsedTime() * 0.3
    })
  
    return <mesh ref={tubeRef} geometry={geometry} material={material} />
  }
  