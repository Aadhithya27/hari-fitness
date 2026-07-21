"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export const Dumbbell3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;

    // 1. Scene setup
    const scene = new THREE.Scene();
    
    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.z = 12;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 4. Create Dumbbell Group
    const dumbbell = new THREE.Group();

    // Materials
    const handleMaterial = new THREE.MeshStandardMaterial({
      color: 0x1e1e1e,
      metalness: 0.9,
      roughness: 0.2,
    });

    const collarMaterial = new THREE.MeshStandardMaterial({
      color: 0x888888,
      metalness: 0.95,
      roughness: 0.1,
    });

    const plateMaterial = new THREE.MeshStandardMaterial({
      color: 0x111111,
      metalness: 0.8,
      roughness: 0.3,
    });

    const glowMaterial = new THREE.MeshStandardMaterial({
      color: 0xff1e1e,
      emissive: 0xff1e1e,
      emissiveIntensity: 2.2,
      roughness: 0.2,
    });

    // Handle (Central Bar)
    const handleGeom = new THREE.CylinderGeometry(0.2, 0.2, 5.0, 32);
    const handleMesh = new THREE.Mesh(handleGeom, handleMaterial);
    handleMesh.rotation.z = Math.PI / 2;
    dumbbell.add(handleMesh);

    // Collars (Lock rings holding weights)
    const collarGeom = new THREE.CylinderGeometry(0.35, 0.35, 0.2, 32);
    
    const collarL = new THREE.Mesh(collarGeom, collarMaterial);
    collarL.rotation.z = Math.PI / 2;
    collarL.position.x = -1.8;
    dumbbell.add(collarL);

    const collarR = new THREE.Mesh(collarGeom, collarMaterial);
    collarR.rotation.z = Math.PI / 2;
    collarR.position.x = 1.8;
    dumbbell.add(collarR);

    // Weight Plates (Left Side)
    // Plate 1 (Inner Larger)
    const plateGeom1 = new THREE.CylinderGeometry(1.6, 1.6, 0.4, 32);
    const plateL1 = new THREE.Mesh(plateGeom1, plateMaterial);
    plateL1.rotation.z = Math.PI / 2;
    plateL1.position.x = -2.1;
    dumbbell.add(plateL1);

    // Plate 2 (Middle)
    const plateGeom2 = new THREE.CylinderGeometry(1.4, 1.4, 0.4, 32);
    const plateL2 = new THREE.Mesh(plateGeom2, plateMaterial);
    plateL2.rotation.z = Math.PI / 2;
    plateL2.position.x = -2.55;
    dumbbell.add(plateL2);

    // Plate 3 (Outer Smaller)
    const plateGeom3 = new THREE.CylinderGeometry(1.2, 1.2, 0.4, 32);
    const plateL3 = new THREE.Mesh(plateGeom3, plateMaterial);
    plateL3.rotation.z = Math.PI / 2;
    plateL3.position.x = -3.0;
    dumbbell.add(plateL3);

    // Weight Plates (Right Side)
    const plateR1 = new THREE.Mesh(plateGeom1, plateMaterial);
    plateR1.rotation.z = Math.PI / 2;
    plateR1.position.x = 2.1;
    dumbbell.add(plateR1);

    const plateR2 = new THREE.Mesh(plateGeom2, plateMaterial);
    plateR2.rotation.z = Math.PI / 2;
    plateR2.position.x = 2.55;
    dumbbell.add(plateR2);

    const plateR3 = new THREE.Mesh(plateGeom3, plateMaterial);
    plateR3.rotation.z = Math.PI / 2;
    plateR3.position.x = 3.0;
    dumbbell.add(plateR3);

    // Glowing Plates Red Inserts (Gives the futuristic HUD/Sci-fi look)
    const glowRingGeom1 = new THREE.CylinderGeometry(1.62, 1.62, 0.05, 32);
    const glowRingL1 = new THREE.Mesh(glowRingGeom1, glowMaterial);
    glowRingL1.rotation.z = Math.PI / 2;
    glowRingL1.position.x = -2.1;
    dumbbell.add(glowRingL1);

    const glowRingR1 = new THREE.Mesh(glowRingGeom1, glowMaterial);
    glowRingR1.rotation.z = Math.PI / 2;
    glowRingR1.position.x = 2.1;
    dumbbell.add(glowRingR1);

    const glowRingGeom2 = new THREE.CylinderGeometry(1.42, 1.42, 0.05, 32);
    const glowRingL2 = new THREE.Mesh(glowRingGeom2, glowMaterial);
    glowRingL2.rotation.z = Math.PI / 2;
    glowRingL2.position.x = -2.55;
    dumbbell.add(glowRingL2);

    const glowRingR2 = new THREE.Mesh(glowRingGeom2, glowMaterial);
    glowRingR2.rotation.z = Math.PI / 2;
    glowRingR2.position.x = 2.55;
    dumbbell.add(glowRingR2);

    scene.add(dumbbell);

    // Adjust scale for smaller screens
    const adjustDumbbellScale = () => {
      const w = window.innerWidth;
      if (w < 640) {
        dumbbell.scale.set(0.65, 0.65, 0.65);
      } else if (w < 1024) {
        dumbbell.scale.set(0.85, 0.85, 0.85);
      } else {
        dumbbell.scale.set(1.15, 1.15, 1.15);
      }
    };
    adjustDumbbellScale();

    // 5. Floating Particle Swarm
    const particleCount = 120;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 15; // X
      particlePositions[i + 1] = (Math.random() - 0.5) * 15; // Y
      particlePositions[i + 2] = (Math.random() - 0.5) * 10; // Z
    }

    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(particlePositions, 3)
    );

    // Draw glowing circles as points
    const pCanvas = document.createElement("canvas");
    pCanvas.width = 16;
    pCanvas.height = 16;
    const ctx = pCanvas.getContext("2d");
    if (ctx) {
      const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
      grad.addColorStop(0, "rgba(255, 30, 30, 1)");
      grad.addColorStop(0.3, "rgba(255, 30, 30, 0.8)");
      grad.addColorStop(1, "rgba(255, 30, 30, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 16, 16);
    }
    const particleTexture = new THREE.CanvasTexture(pCanvas);

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.18,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    // 6. Lights Setup
    const ambientLight = new THREE.AmbientLight(0x050505, 0.8);
    scene.add(ambientLight);

    const redSpotLight1 = new THREE.DirectionalLight(0xff1e1e, 3.5);
    redSpotLight1.position.set(-6, 4, 3);
    scene.add(redSpotLight1);

    const redSpotLight2 = new THREE.DirectionalLight(0xb30000, 2.5);
    redSpotLight2.position.set(6, -4, -3);
    scene.add(redSpotLight2);

    const whiteHighlight = new THREE.DirectionalLight(0xffffff, 2.0);
    whiteHighlight.position.set(2, 6, 8);
    scene.add(whiteHighlight);

    // 7. Mouse Responsiveness
    let targetX = 0;
    let targetY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      // Normalize values between -1 and 1
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // 8. Animation loop
    const clock = new THREE.Clock();
    let animationId: number;

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Idle floating motion (Anti-gravity feel)
      dumbbell.position.y = Math.sin(elapsedTime * 1.2) * 0.25;
      dumbbell.position.x = Math.cos(elapsedTime * 0.8) * 0.15;
      
      // Idle continuous rotations
      dumbbell.rotation.x = elapsedTime * 0.15;
      dumbbell.rotation.y = elapsedTime * 0.25;

      // Mouse tracking interpolation
      targetX = mouseX * 0.6;
      targetY = mouseY * 0.6;
      
      // Tilt dumbbell based on mouse
      dumbbell.rotation.z += (targetX - dumbbell.rotation.z) * 0.05;
      dumbbell.rotation.x += (targetY - dumbbell.rotation.x) * 0.05;

      // Float particles
      const positions = particleGeometry.attributes.position.array as Float32Array;
      for (let i = 1; i < particleCount * 3; i += 3) {
        // Translate particles slightly vertically
        positions[i] += Math.sin(elapsedTime + i) * 0.003;
        // Keep them bounded
        if (positions[i] > 8) positions[i] = -8;
        if (positions[i] < -8) positions[i] = 8;
      }
      particleGeometry.attributes.position.needsUpdate = true;
      particleSystem.rotation.y = elapsedTime * 0.02;

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };

    animate();

    // 9. Resize Handling
    const handleResize = () => {
      if (!containerRef.current) return;
      
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(container.clientWidth, container.clientHeight);
      adjustDumbbellScale();
    };

    window.addEventListener("resize", handleResize);

    // 10. Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      
      // Dispose materials/geometries
      handleGeom.dispose();
      collarGeom.dispose();
      plateGeom1.dispose();
      plateGeom2.dispose();
      plateGeom3.dispose();
      glowRingGeom1.dispose();
      glowRingGeom2.dispose();
      particleGeometry.dispose();
      
      handleMaterial.dispose();
      collarMaterial.dispose();
      plateMaterial.dispose();
      glowMaterial.dispose();
      particleMaterial.dispose();
      particleTexture.dispose();
      pCanvas.remove();

      renderer.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};
export default Dumbbell3D;
