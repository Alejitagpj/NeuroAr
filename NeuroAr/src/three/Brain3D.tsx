import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import {
  BRAIN_REGIONS,
  buildBrainGeometry,
  RANGE_HEX,
  type DomainRange,
} from "./brainGeometry";

type RegionRanges = Record<string, DomainRange>;

type Brain3DProps = {
  ranges?: RegionRanges; // dominio -> rango (colorea las regiones)
  activeDomain?: string | null;
  onRegionClick?: (domain: string) => void;
  interactive?: boolean; // muestra marcadores clicables (modo paciente)
};

function NeuralCloud() {
  const groupRef = useRef<THREE.Group>(null);
  const { nodes, edges } = useMemo(() => buildBrainGeometry(640, 7), []);

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.12;
  });

  const nodeGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(nodes, 3));
    return g;
  }, [nodes]);

  const edgeGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(edges, 3));
    return g;
  }, [edges]);

  return (
    <group ref={groupRef}>
      <lineSegments geometry={edgeGeom}>
        <lineBasicMaterial color="#2563eb" transparent opacity={0.18} />
      </lineSegments>
      <points geometry={nodeGeom}>
        <pointsMaterial
          color="#7dd3fc"
          size={0.045}
          sizeAttenuation
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

function RegionMarker({
  domain,
  anat,
  position,
  color,
  active,
  interactive,
  onClick,
}: {
  domain: string;
  anat: string;
  position: [number, number, number];
  color: string;
  active: boolean;
  interactive: boolean;
  onClick?: () => void;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const [hover, setHover] = useState(false);
  const show = hover || active;

  useFrame((state) => {
    if (!ref.current) return;
    const pulse = active ? 1.25 + Math.sin(state.clock.elapsedTime * 4) * 0.12 : show ? 1.2 : 1;
    ref.current.scale.setScalar(THREE.MathUtils.lerp(ref.current.scale.x, pulse, 0.2));
  });

  return (
    <group position={position}>
      <mesh
        ref={ref}
        onPointerOver={(e) => {
          if (!interactive) return;
          e.stopPropagation();
          setHover(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHover(false);
          document.body.style.cursor = "auto";
        }}
        onClick={(e) => {
          if (!interactive) return;
          e.stopPropagation();
          onClick?.();
        }}
      >
        <sphereGeometry args={[0.085, 24, 24]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={active ? 1.6 : show ? 1.1 : 0.6}
          roughness={0.3}
        />
      </mesh>
      {/* halo */}
      <mesh scale={1.8}>
        <sphereGeometry args={[0.085, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={show ? 0.18 : 0.08} />
      </mesh>
      {interactive && show && (
        <Html center distanceFactor={8} style={{ pointerEvents: "none" }}>
          <div className="whitespace-nowrap rounded-md bg-slate-900/90 px-2 py-1 text-[11px] font-medium text-white shadow-lg ring-1 ring-white/10">
            {domain}
            <span className="ml-1 text-slate-400">· {anat}</span>
          </div>
        </Html>
      )}
    </group>
  );
}

function Scene({ ranges, activeDomain, onRegionClick, interactive }: Brain3DProps) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[4, 4, 4]} intensity={40} color="#bae6fd" />
      <pointLight position={[-4, -2, -3]} intensity={25} color="#6366f1" />

      <NeuralCloud />

      {interactive &&
        BRAIN_REGIONS.map((r) => {
          const range = ranges?.[r.domain];
          const color = range ? RANGE_HEX[range] : "#38bdf8";
          return (
            <RegionMarker
              key={r.domain}
              domain={r.domain}
              anat={r.anat}
              position={r.position}
              color={color}
              active={activeDomain === r.domain}
              interactive={interactive}
              onClick={() => onRegionClick?.(r.domain)}
            />
          );
        })}

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={!interactive}
        autoRotateSpeed={0.6}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={(2 * Math.PI) / 3}
      />
    </>
  );
}

export default function Brain3D(props: Brain3DProps) {
  return (
    <Canvas
      camera={{ position: [0, 0.2, 4.2], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ touchAction: "none" }}
    >
      <Scene {...props} />
    </Canvas>
  );
}
