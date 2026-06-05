// Geometría procedural de un "cerebro neuronal": nube de nodos en dos hemisferios
// + conexiones (red neuronal) + 6 regiones mapeadas a dominios cognitivos.
// No requiere modelo .glb externo (robusto y offline-friendly).

export type DomainRange = "bajo" | "esperado" | "destacado";

export type BrainRegion = {
  domain: string;
  anat: string; // zona anatómica aproximada (para el label)
  position: [number, number, number];
};

// Mapeo dominio → zona anatómica aproximada (cerebro: +z frente, -z occipucio, +y arriba).
export const BRAIN_REGIONS: BrainRegion[] = [
  { domain: "Funciones ejecutivas", anat: "Corteza prefrontal", position: [-0.45, 0.62, 0.92] },
  { domain: "Atención", anat: "Lóbulo frontal", position: [0.5, 0.55, 0.9] },
  { domain: "Lenguaje", anat: "Área temporal izq.", position: [-1.08, -0.05, 0.15] },
  { domain: "Memoria", anat: "Lóbulo temporal medial", position: [1.02, -0.18, -0.05] },
  { domain: "Velocidad de procesamiento", anat: "Región parietal", position: [0.05, 0.98, -0.1] },
  { domain: "Habilidades visuoespaciales", anat: "Lóbulo occipital", position: [0.0, 0.1, -1.15] },
];

// RNG con semilla para una forma estable entre renders.
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type BrainGeometry = {
  nodes: Float32Array; // xyz por nodo
  edges: Float32Array; // pares xyz (lineSegments)
  count: number;
};

// Genera nodos cerca de la superficie de dos elipsoides (hemisferios) con "surcos".
export function buildBrainGeometry(nodeCount = 640, seed = 7): BrainGeometry {
  const rnd = mulberry32(seed);
  const pts: number[] = [];

  const sx = 0.62, sy = 0.74, sz = 1.0; // forma del hemisferio
  const gap = 0.5; // separación entre hemisferios

  for (let i = 0; i < nodeCount; i++) {
    const left = i % 2 === 0;
    // dirección aleatoria sobre la esfera
    const u = rnd();
    const v = rnd();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    let x = Math.sin(phi) * Math.cos(theta);
    let y = Math.sin(phi) * Math.sin(theta);
    let z = Math.cos(phi);

    // cáscara (corteza): radio cerca de la superficie
    const shell = 0.82 + rnd() * 0.18;
    // "surcos" (gyri) con ondas
    const wrinkle = 0.06 * Math.sin(6 * theta) * Math.cos(5 * phi);

    x *= (sx + wrinkle) * shell;
    y *= (sy + wrinkle) * shell;
    z *= (sz + wrinkle) * shell;

    // desplazar a cada hemisferio y empujar hacia afuera para abrir el medio
    const off = left ? -gap : gap;
    x += off;
    // aplanar un poco la cara medial
    if ((left && x > -gap * 0.2) || (!left && x < gap * 0.2)) {
      x += left ? -0.05 : 0.05;
    }

    pts.push(x, y, z);
  }

  const nodes = new Float32Array(pts);

  // Conexiones: para cada nodo, muestrea algunos y conecta los cercanos (red neuronal).
  const edgeList: number[] = [];
  const n = nodeCount;
  const maxEdges = 1100;
  const threshold = 0.42;
  for (let i = 0; i < n && edgeList.length / 6 < maxEdges; i++) {
    const ax = nodes[i * 3], ay = nodes[i * 3 + 1], az = nodes[i * 3 + 2];
    let made = 0;
    for (let s = 0; s < 10 && made < 2; s++) {
      const j = (i + 1 + Math.floor(rnd() * (n - 1))) % n;
      const bx = nodes[j * 3], by = nodes[j * 3 + 1], bz = nodes[j * 3 + 2];
      const dx = ax - bx, dy = ay - by, dz = az - bz;
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (d < threshold) {
        edgeList.push(ax, ay, az, bx, by, bz);
        made++;
      }
    }
  }

  return { nodes, edges: new Float32Array(edgeList), count: nodeCount };
}

export const RANGE_HEX: Record<DomainRange, string> = {
  bajo: "#f87171",
  esperado: "#38bdf8",
  destacado: "#34d399",
};
