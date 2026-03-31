"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import * as THREE from "three";

const TwistedWireTerminal = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const canvas = document.createElement("canvas");
    container.appendChild(canvas);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 100;

    const terminal = document.querySelector(".terminal");
    if (!terminal) return;

    // Accurate center using bounding box
    const terminalRect = terminal.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const center = {
      x: terminalRect.left - containerRect.left + terminalRect.width / 2,
      y: terminalRect.top - containerRect.top + terminalRect.height / 2,
      z: 0,
    };

    // Debug center point (remove if not needed)
    const debugDot = document.createElement("div");
    debugDot.style.position = "absolute";
    debugDot.style.width = "10px";
    debugDot.style.height = "10px";
    debugDot.style.backgroundColor = "red";
    debugDot.style.borderRadius = "50%";
    debugDot.style.left = `${center.x - 5}px`;
    debugDot.style.top = `${center.y - 5}px`;
    container.appendChild(debugDot);

    // Create points for the ring
    const points = [];
    const radius = 40;
    const numPoints = 100;
    for (let i = 0; i <= numPoints; i++) {
      const angle = (i / numPoints) * Math.PI * 2;
      const x = center.x + radius * Math.cos(angle);
      const y = center.y + radius * Math.sin(angle);
      const z = center.z + 10 * Math.sin(angle * 3);
      points.push(new THREE.Vector3(x, y, z));
    }

    const curve = new THREE.CatmullRomCurve3(points);
    const geometry = new THREE.TubeGeometry(curve, 200, 1.5, 12, true);

    const material = new THREE.MeshBasicMaterial({
      color: 0xff00ff,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Animate the ring
    gsap.to(mesh.rotation, {
      y: "+=6.28319", // 2 * Math.PI
      repeat: -1,
      duration: 15,
      ease: "linear",
    });

    const handleResize = () => {
      renderer.setSize(container.clientWidth, container.clientHeight);
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      container.removeChild(canvas);
      container.removeChild(debugDot);
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 z-0" />;
};

export default TwistedWireTerminal;
