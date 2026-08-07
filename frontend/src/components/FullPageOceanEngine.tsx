'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function FullPageOceanEngine() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene, Light Sky Fog & Camera Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050b14, 0.0055);

    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 13, 35);
    camera.lookAt(0, 0, -50);

    // 2. High-Performance WebGL Renderer Setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35; // Bright sun-drenched exposure
    container.appendChild(renderer.domElement);

    // 3. Sun-Drenched Mediterranean Azure & Golden Sun-Path Uniforms
    const oceanUniforms = {
      uTime: { value: 0 },
      uScrollProgress: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uBaseAzure: { value: new THREE.Color('#00609C') },
      uDeepBlue: { value: new THREE.Color('#0077B6') },
      uMidCerulean: { value: new THREE.Color('#0096C7') },
      uBrightSkyBlue: { value: new THREE.Color('#38BDF8') },
      uIceBlueCrest: { value: new THREE.Color('#7DD3FC') },
      uSunlightWhite: { value: new THREE.Color('#FFFFFF') },
      uSunriseAmber: { value: new THREE.Color('#FFB703') },
      uSunrisePeach: { value: new THREE.Color('#FF9E79') },
      uGoldenRadiance: { value: new THREE.Color('#FFE5B4') },
    };

    // 4. Vertex Shader - Gerstner Wave Multi-Octave Physics & Mouse Ripple
    const vertexShader = `
      uniform float uTime;
      uniform float uScrollProgress;
      uniform vec2 uMouse;

      varying vec3 vWorldPosition;
      varying vec3 vNormal;
      varying float vWaveHeight;
      varying vec2 vUv;

      float calculateWave(vec2 pos, float time, float scroll) {
        float freq1 = 0.045 + scroll * 0.025;
        float speed1 = time * 0.95;
        float wave1 = sin(pos.x * freq1 + speed1) * cos(pos.y * freq1 * 0.85 + speed1 * 0.9) * 2.4;

        float freq2 = 0.095 + scroll * 0.045;
        float speed2 = time * 1.4;
        float wave2 = sin(pos.x * freq2 - speed2) * sin(pos.y * freq2 * 1.25 + speed2) * 1.25;

        float freq3 = 0.19;
        float speed3 = time * 2.2;
        float wave3 = cos(pos.x * freq3 + speed3) * sin(pos.y * freq3 - speed3) * 0.45;

        // Interactive Cursor Ripple Wake
        float distToMouse = distance(pos, uMouse * 85.0);
        float mouseRipple = sin(distToMouse * 0.32 - time * 4.2) * exp(-distToMouse * 0.055) * 2.0;

        return wave1 + wave2 + wave3 + mouseRipple;
      }

      void main() {
        vUv = uv;
        vec3 pos = position;

        float elevation = calculateWave(pos.xy, uTime, uScrollProgress);
        pos.z += elevation;

        vWaveHeight = elevation;

        // Compute Surface Normals
        float delta = 0.08;
        float waveX = calculateWave(pos.xy + vec2(delta, 0.0), uTime, uScrollProgress);
        float waveY = calculateWave(pos.xy + vec2(0.0, delta), uTime, uScrollProgress);
        vec3 grad = vec3((waveX - elevation) / delta, (waveY - elevation) / delta, 1.0);
        vNormal = normalize(normalMatrix * grad);

        vec4 worldPos = modelMatrix * vec4(pos, 1.0);
        vWorldPosition = worldPos.xyz;

        gl_Position = projectionMatrix * viewMatrix * worldPos;
      }
    `;

    // 5. Fragment Shader - Crystal-Clear Sun-Lit Blue Ocean & Blinding Golden Sun-Path (Zlatá Sluneční Cesta)
    const fragmentShader = `
      uniform float uTime;
      uniform float uScrollProgress;
      uniform vec3 uBaseAzure;
      uniform vec3 uDeepBlue;
      uniform vec3 uMidCerulean;
      uniform vec3 uBrightSkyBlue;
      uniform vec3 uIceBlueCrest;
      uniform vec3 uSunlightWhite;
      uniform vec3 uSunriseAmber;
      uniform vec3 uSunrisePeach;
      uniform vec3 uGoldenRadiance;

      varying vec3 vWorldPosition;
      varying vec3 vNormal;
      varying float vWaveHeight;
      varying vec2 vUv;

      void main() {
        vec3 viewDir = normalize(cameraPosition - vWorldPosition);
        
        // Fresnel Reflection
        float fresnel = pow(1.0 - max(0.0, dot(viewDir, vNormal)), 2.8);

        // Blinding Sun-Path Direct Reflection (Zlatá sluneční cesta od horizontu)
        vec3 sunDir = normalize(vec3(0.0, 18.0, -90.0));
        vec3 halfDir = normalize(sunDir + viewDir);
        float sunPathSpecular = pow(max(0.0, dot(vNormal, halfDir)), 36.0);
        float wideSunBeam = exp(-pow(vWorldPosition.x * 0.015, 2.0)); // Wide beam extending down screen

        // 1. Bright Mediterranean Azure Water Volume (#00609C to #0077B6 - NO BLACKS!)
        vec3 waterBase = mix(uBaseAzure, uDeepBlue, vWaveHeight * 0.15 + 0.5);

        // 2. Mid-Wave Swells (Bright Cerulean #0096C7 to Sky Blue #38BDF8)
        vec3 swellColor = mix(uMidCerulean, uBrightSkyBlue, sin(vWorldPosition.x * 0.025 + uTime * 0.7) * 0.5 + 0.5);
        vec3 seaVolume = mix(waterBase, swellColor, smoothstep(-1.2, 1.8, vWaveHeight));

        // 3. Wave Crests & Top Peaks (Ice Blue #7DD3FC & Pure Sunlight White)
        float crestFactor = smoothstep(0.4, 2.8, vWaveHeight);
        vec3 finalSea = mix(seaVolume, uIceBlueCrest, crestFactor * 0.55 + fresnel * 0.4);

        // 4. Blinding Golden Sun-Path Reflections (Zlatá Sluneční Cesta)
        vec3 goldenSunReflect = mix(uSunriseAmber, uGoldenRadiance, sin(vWorldPosition.x * 0.04 + uTime) * 0.5 + 0.5);
        finalSea += goldenSunReflect * sunPathSpecular * wideSunBeam * 2.2;
        finalSea += uSunlightWhite * pow(sunPathSpecular, 2.0) * 1.2;

        // Soft Crystal Sea Foam
        float foam = smoothstep(1.9, 3.4, vWaveHeight);
        finalSea += uSunlightWhite * foam * 0.4;

        // Distance Fog & Massive Sunrise Atmosphere at Horizon
        float dist = length(vWorldPosition - cameraPosition);
        float fogFactor = 1.0 - exp(-dist * 0.005);
        
        vec3 horizonSunriseGlow = mix(uSunrisePeach, uGoldenRadiance, sin(uTime * 0.5) * 0.5 + 0.5);
        finalSea = mix(finalSea, horizonSunriseGlow, fogFactor * 0.65);

        gl_FragColor = vec4(finalSea, 1.0);
      }
    `;

    // 6. Geometry & Material Setup
    const oceanGeometry = new THREE.PlaneGeometry(400, 400, 160, 160);
    const oceanMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: oceanUniforms,
      side: THREE.DoubleSide,
      wireframe: false,
    });

    const oceanMesh = new THREE.Mesh(oceanGeometry, oceanMaterial);
    oceanMesh.rotation.x = -Math.PI / 2;
    scene.add(oceanMesh);

    // 7. Powerful Rising Sun Lighting (Zlaté slunce nad horizontem)
    const ambientLight = new THREE.AmbientLight(0x0077b6, 1.6);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffb703, 2.8);
    sunLight.position.set(0, 20, -90);
    scene.add(sunLight);

    // 8. LERP State & Event Listeners
    let targetScroll = 0;
    let currentScroll = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handleScroll = () => {
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      targetScroll = Math.min(1, Math.max(0, window.scrollY / maxScroll));
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', handleResize);

    handleScroll();

    // 9. 60 FPS Animation Loop
    const clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth LERP Damping
      currentScroll += (targetScroll - currentScroll) * 0.05;
      currentMouseX += (targetMouseX - currentMouseX) * 0.08;
      currentMouseY += (targetMouseY - currentMouseY) * 0.08;

      // Update Uniform Values
      oceanUniforms.uTime.value = elapsedTime;
      oceanUniforms.uScrollProgress.value = currentScroll;
      oceanUniforms.uMouse.value.set(currentMouseX, currentMouseY);

      // Continuous Camera Glide Over Sea Surface
      camera.position.z = 35 - currentScroll * 55;
      camera.position.y = 13 + Math.sin(elapsedTime * 0.5) * 0.6 - currentScroll * 3;
      camera.lookAt(0, -currentScroll * 5, -80);

      renderer.render(scene, camera);
    };

    animate();

    // 10. Clean GPU Memory Cleanup on Unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);

      oceanGeometry.dispose();
      oceanMaterial.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-1 overflow-hidden"
    />
  );
}


