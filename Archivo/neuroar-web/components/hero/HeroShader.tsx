'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

function BrainPoints() {
  const ref = useRef<THREE.Points>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  const { positions, originals } = useMemo(() => {
    const count = 2400;
    const positions = new Float32Array(count * 3);
    const originals = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Sphere shell with noise to look brain-ish
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const r = 1.6 + (Math.random() - 0.5) * 0.25 + Math.sin(theta * 6 + phi * 4) * 0.08;
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta) * 0.85; // slight vertical squash
      const z = r * Math.cos(phi);
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      originals[i * 3] = x;
      originals[i * 3 + 1] = y;
      originals[i * 3 + 2] = z;
    }
    return { positions, originals };
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (!ref.current) return;
    const geom = ref.current.geometry;
    const pos = geom.attributes.position.array as Float32Array;
    const mx = state.mouse.x;
    const my = state.mouse.y;
    mouseRef.current.x += (mx - mouseRef.current.x) * 0.06;
    mouseRef.current.y += (my - mouseRef.current.y) * 0.06;

    for (let i = 0; i < pos.length; i += 3) {
      const ox = originals[i];
      const oy = originals[i + 1];
      const oz = originals[i + 2];
      const noise = Math.sin(t * 0.6 + ox * 2 + oy * 2) * 0.04;
      // Repulsion-ish based on mouse
      const dx = ox - mouseRef.current.x * 2;
      const dy = oy - mouseRef.current.y * 2;
      const d2 = dx * dx + dy * dy + 0.5;
      const force = 0.18 / d2;
      pos[i] = ox + dx * force + noise;
      pos[i + 1] = oy + dy * force + noise;
      pos[i + 2] = oz + noise;
    }
    geom.attributes.position.needsUpdate = true;
    ref.current.rotation.y = t * 0.05;
    ref.current.rotation.x = Math.sin(t * 0.2) * 0.08;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.018}
        color="#7AE7FF"
        transparent
        opacity={0.85}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function ConnectingLines() {
  const ref = useRef<THREE.LineSegments>(null);
  const geometry = useMemo(() => {
    const count = 60;
    const positions = new Float32Array(count * 2 * 3);
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const b = Math.random() * Math.PI;
      const r1 = 1.55;
      const x1 = r1 * Math.sin(b) * Math.cos(a);
      const y1 = r1 * Math.sin(b) * Math.sin(a) * 0.85;
      const z1 = r1 * Math.cos(b);
      const a2 = a + (Math.random() - 0.5) * 0.6;
      const b2 = b + (Math.random() - 0.5) * 0.6;
      const x2 = r1 * Math.sin(b2) * Math.cos(a2);
      const y2 = r1 * Math.sin(b2) * Math.sin(a2) * 0.85;
      const z2 = r1 * Math.cos(b2);
      positions.set([x1, y1, z1, x2, y2, z2], i * 6);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return g;
  }, []);

  useFrame((s) => {
    if (!ref.current) return;
    ref.current.rotation.y = s.clock.elapsedTime * 0.05;
    ref.current.rotation.x = Math.sin(s.clock.elapsedTime * 0.2) * 0.08;
  });

  return (
    <lineSegments ref={ref} geometry={geometry}>
      <lineBasicMaterial color="#A78BFA" transparent opacity={0.25} blending={THREE.AdditiveBlending} />
    </lineSegments>
  );
}

export function HeroShader() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 55 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.4} />
        <BrainPoints />
        <ConnectingLines />
      </Canvas>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-bg/40 via-transparent to-bg" />
    </div>
  );
}
