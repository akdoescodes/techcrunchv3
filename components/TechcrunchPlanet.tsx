// components/TechcrunchPlanet.tsx
"use client"

import { useRef, useEffect } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

export default function TechcrunchPlanet() {
  const mountRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const mount = mountRef.current!
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ alpha: true })
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    mount.appendChild(renderer.domElement)

    // Glow color and background
    scene.background = null
    const color = new THREE.Color(0x5b21b6) // Deep purple

    // Create glowing planet text
    const loader = new THREE.FontLoader()
    loader.load("/fonts/helvetiker_bold.typeface.json", (font) => {
      const textGeometry = new THREE.TextGeometry("TECHCRUNCH", {
        font,
        size: 2,
        height: 0.5,
        bevelEnabled: true,
        bevelThickness: 0.05,
        bevelSize: 0.05,
        bevelSegments: 10,
      })
      const textMaterial = new THREE.MeshStandardMaterial({ color: 0x9333ea, emissive: 0x9333ea, emissiveIntensity: 1.5 })
      const textMesh = new THREE.Mesh(textGeometry, textMaterial)
      textGeometry.center()
      scene.add(textMesh)
    })

    // Ambient light
    scene.add(new THREE.AmbientLight(0xffffff, 0.6))
    const pointLight = new THREE.PointLight(0xffffff, 1)
    pointLight.position.set(10, 10, 10)
    scene.add(pointLight)

    // Orbiting lines
    const orbitCount = 50
    const orbits: THREE.Line[] = []
    for (let i = 0; i < orbitCount; i++) {
      const radius = 4 + Math.random() * 2
      const curve = new THREE.EllipseCurve(0, 0, radius, radius, 0, 2 * Math.PI, false, 0)
      const points = curve.getPoints(50)
      const geometry = new THREE.BufferGeometry().setFromPoints(points.map(p => new THREE.Vector3(p.x, 0, p.y)))
      const material = new THREE.LineBasicMaterial({ color: 0xc084fc, opacity: 0.3, transparent: true })
      const line = new THREE.LineLoop(geometry, material)
      line.rotation.x = Math.random() * Math.PI
      line.rotation.y = Math.random() * Math.PI
      scene.add(line)
      orbits.push(line)
    }

    // Asteroids (particles)
    const particleGeometry = new THREE.SphereGeometry(0.05)
    const particleMaterial = new THREE.MeshStandardMaterial({ color: 0x9333ea })
    for (let i = 0; i < 100; i++) {
      const particle = new THREE.Mesh(particleGeometry, particleMaterial)
      particle.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      )
      scene.add(particle)
    }

    camera.position.z = 10

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableZoom = false
    controls.enablePan = false

    const animate = () => {
      requestAnimationFrame(animate)
      orbits.forEach((orbit, i) => {
        orbit.rotation.y += 0.001 + i * 0.00005
      })
      renderer.render(scene, camera)
    }

    animate()

    return () => {
      mount.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={mountRef} className="w-full h-[300px] md:h-[400px] lg:h-[500px]" />
}
