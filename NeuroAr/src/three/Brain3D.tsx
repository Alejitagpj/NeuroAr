import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import {
  BRAIN_REGIONS,
  buildBrainGeometry,
  focusCameraFor,
  RANGE_HEX,
  type DomainRange,
} from "./brainGeometry";

type RegionRanges = Record<string, DomainRange>;
type RegionIntensities = Record<string, number>; // dominio -> 0..1 (percentil/100)

type Brain3DProps = {
  ranges?: RegionRanges; // dominio -> rango (colorea las regiones)
  intensities?: RegionIntensities; // dominio -> percentil normalizado (tamaño/brillo)
  activeDomain?: string | null;
  onRegionClick?: (domain: string) => void;
  interactive?: boolean; // muestra labels clicables y permite enfoque de cámara
  showRegions?: boolean; // dibuja los marcadores de región (por defecto = interactive)
};

function NeuralCloud({ active }: { active: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const { nodes, edges } = useMemo(() => buildBrainGeometry(640, 7), []);

  useFrame((_, delta) => {
    // Al enfocar un dominio la rotación se calma para no marear.
    if (groupRef.current) groupRef.current.rotation.y += delta * (active ? 0.03 : 0.12);
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
  intensity,
  active,
  dimmed,
  interactive,
  onClick,
}: {
  domain: string;
  anat: string;
  position: [number, number, number];
  color: string;
  intensity: number; // 0..1
  active: boolean;
  dimmed: boolean;
  interactive: boolean;
  onClick?: () => void;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const [hover, setHover] = useState(false);
  const show = hover || active;
  // El radio base crece con el percentil (datos → tamaño).
  const baseR = 0.06 + intensity * 0.06;

  useFrame((state) => {
    if (!ref.current) return;
    const pulse = active
      ? 1.3 + Math.sin(state.clock.elapsedTime * 4) * 0.14
      : show
      ? 1.2
      : 1;
    ref.current.scale.setScalar(THREE.MathUtils.lerp(ref.current.scale.x, pulse, 0.2));
  });

  const opacity = dimmed && !show ? 0.35 : 1;

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
        <sphereGeometry args={[baseR, 24, 24]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={active ? 1.8 : show ? 1.2 : 0.5 + intensity * 0.5}
          roughness={0.3}
          transparent
          opacity={opacity}
        />
      </mesh>
      {/* halo proporcional al dato */}
      <mesh scale={1.7 + intensity * 0.8}>
        <sphereGeometry args={[baseR, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={show ? 0.2 : 0.08 + intensity * 0.06} />
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

// Anima la cámara/objetivo hacia la región activa (zoom por dominio).
function CameraRig({
  controlsRef,
  activeDomain,
  enabled,
}: {
  controlsRef: React.RefObject<OrbitControlsImpl>;
  activeDomain?: string | null;
  enabled: boolean;
}) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 0.2, 4.2));
  const lookAt = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    const region = activeDomain ? BRAIN_REGIONS.find((r) => r.domain === activeDomain) : null;
    if (region && enabled) {
      targetPos.current.set(...focusCameraFor(region.position));
      lookAt.current.set(...region.position);
    } else {
      targetPos.current.set(0, 0.2, 4.2);
      lookAt.current.set(0, 0, 0);
    }
  }, [activeDomain, enabled]);

  useFrame(() => {
    camera.position.lerp(targetPos.current, 0.08);
    const c = controlsRef.current;
    if (c) {
      c.target.lerp(lookAt.current, 0.08);
      c.update();
    }
  });

  return null;
}

function Scene({ ranges, intensities, activeDomain, onRegionClick, interactive, showRegions }: Brain3DProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const drawRegions = showRegions ?? interactive;
  const hasActive = Boolean(activeDomain);

  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[4, 4, 4]} intensity={40} color="#bae6fd" />
      <pointLight position={[-4, -2, -3]} intensity={25} color="#6366f1" />

      <NeuralCloud active={hasActive && Boolean(interactive)} />

      {drawRegions &&
        BRAIN_REGIONS.map((r) => {
          const range = ranges?.[r.domain];
          const color = range ? RANGE_HEX[range] : "#38bdf8";
          const intensity = intensities?.[r.domain] ?? 0.5;
          return (
            <RegionMarker
              key={r.domain}
              domain={r.domain}
              anat={r.anat}
              position={r.position}
              color={color}
              intensity={intensity}
              active={activeDomain === r.domain}
              dimmed={hasActive && activeDomain !== r.domain}
              interactive={interactive ?? false}
              onClick={() => onRegionClick?.(r.domain)}
            />
          );
        })}

      <OrbitControls
        ref={controlsRef}
        enableZoom={false}
        enablePan={false}
        autoRotate={!interactive && !hasActive}
        autoRotateSpeed={0.6}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={(2 * Math.PI) / 3}
      />
      <CameraRig controlsRef={controlsRef} activeDomain={activeDomain} enabled={Boolean(interactive)} />
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
