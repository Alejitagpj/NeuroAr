'use client';

import { motion } from 'framer-motion';
import type { Range } from '@/lib/reports';

interface Props {
  percentile: number;
  range: Range;
}

// Standard normal density via Box-Muller-ish formula
function pdf(z: number) {
  return Math.exp(-0.5 * z * z) / Math.sqrt(2 * Math.PI);
}

// Approximate inverse CDF (Beasley-Springer-Moro short form) — good enough for visualization
function invNormCdf(p: number): number {
  if (p <= 0) return -4;
  if (p >= 1) return 4;
  const a = [-39.696, 220.946, -275.928, 138.357, -30.664, 2.5066];
  const b = [-54.476, 161.585, -155.699, 66.801, -13.28];
  const c = [-0.0077849, -0.32239, -2.40076, -2.54973, 4.37466, 2.93816];
  const d = [0.0077847, 0.32246, 2.44513, 3.75441];
  const pl = 0.02425;
  let q, r;
  if (p < pl) {
    q = Math.sqrt(-2 * Math.log(p));
    return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  } else if (p <= 1 - pl) {
    q = p - 0.5;
    r = q * q;
    return ((((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q) /
      (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
  } else {
    q = Math.sqrt(-2 * Math.log(1 - p));
    return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }
}

export function PercentileCurve({ percentile, range }: Props) {
  const W = 640;
  const H = 220;
  const padX = 24;
  const padY = 24;
  const zMin = -3;
  const zMax = 3;

  const xFor = (z: number) => padX + ((z - zMin) / (zMax - zMin)) * (W - 2 * padX);
  const maxY = pdf(0);
  const yFor = (d: number) => H - padY - (d / maxY) * (H - 2 * padY);

  const samples = 120;
  const pts: string[] = [];
  for (let i = 0; i <= samples; i++) {
    const z = zMin + (i / samples) * (zMax - zMin);
    pts.push(`${xFor(z).toFixed(2)},${yFor(pdf(z)).toFixed(2)}`);
  }
  const linePath = `M ${pts.join(' L ')}`;
  const fillPath = `M ${xFor(zMin)},${H - padY} L ${pts.join(' L ')} L ${xFor(zMax)},${H - padY} Z`;

  const z = invNormCdf(percentile / 100);
  const px = xFor(z);
  const py = yFor(pdf(z));

  const color = range === 'destacado' ? '#34D399' : range === 'bajo' ? '#FB7185' : '#7AE7FF';

  // Range bands (low <25, expected 25-75, high >75) — z thresholds
  const zLow = invNormCdf(0.25);
  const zHigh = invNormCdf(0.75);

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
        <defs>
          <linearGradient id="curveFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.32} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>

        {/* Bands */}
        <rect x={xFor(zMin)} y={padY} width={xFor(zLow) - xFor(zMin)} height={H - 2 * padY} fill="rgba(251,113,133,0.05)" />
        <rect x={xFor(zHigh)} y={padY} width={xFor(zMax) - xFor(zHigh)} height={H - 2 * padY} fill="rgba(52,211,153,0.05)" />

        {/* Baseline */}
        <line x1={padX} y1={H - padY} x2={W - padX} y2={H - padY} stroke="rgba(255,255,255,0.1)" />

        {/* Curve fill + line */}
        <motion.path
          d={fillPath}
          fill="url(#curveFill)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        />
        <motion.path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth={2}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Patient point */}
        <motion.g
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          <circle cx={px} cy={py} r={14} fill={color} opacity={0.18} />
          <circle cx={px} cy={py} r={6} fill={color} stroke="#0A0E1A" strokeWidth={2} />
          <line x1={px} y1={py + 8} x2={px} y2={H - padY} stroke={color} strokeWidth={1} strokeDasharray="3 3" opacity={0.6} />
        </motion.g>

        {/* Labels */}
        <text x={padX} y={H - 6} fontSize="10" fill="rgba(255,255,255,0.4)" fontFamily="monospace">
          pctl 1
        </text>
        <text x={W / 2} y={H - 6} fontSize="10" fill="rgba(255,255,255,0.4)" fontFamily="monospace" textAnchor="middle">
          media (50)
        </text>
        <text x={W - padX} y={H - 6} fontSize="10" fill="rgba(255,255,255,0.4)" fontFamily="monospace" textAnchor="end">
          pctl 99
        </text>

        <motion.text
          x={px}
          y={py - 18}
          fontSize="12"
          fill={color}
          fontFamily="monospace"
          textAnchor="middle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          tú estás aquí
        </motion.text>
      </svg>
    </div>
  );
}
