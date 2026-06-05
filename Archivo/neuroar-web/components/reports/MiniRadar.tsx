'use client';

import type { DomainResult } from '@/lib/reports';

interface Props {
  domains: DomainResult[];
  size?: number;
}

export function MiniRadar({ domains, size = 180 }: Props) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 18;
  const n = domains.length;

  const point = (i: number, value: number) => {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    const rr = (value / 100) * r;
    return { x: cx + rr * Math.cos(angle), y: cy + rr * Math.sin(angle) };
  };

  const polygon = domains
    .map((d, i) => {
      const p = point(i, d.percentile);
      return `${p.x},${p.y}`;
    })
    .join(' ');

  const axis = domains.map((_, i) => {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
      {[0.25, 0.5, 0.75, 1].map((s) => (
        <circle
          key={s}
          cx={cx}
          cy={cy}
          r={r * s}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={1}
        />
      ))}
      {axis.map((a, i) => (
        <line key={i} x1={cx} y1={cy} x2={a.x} y2={a.y} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
      ))}
      <polygon
        points={polygon}
        fill="rgba(122,231,255,0.18)"
        stroke="#7AE7FF"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      {domains.map((d, i) => {
        const p = point(i, d.percentile);
        const color = d.range === 'destacado' ? '#34D399' : d.range === 'bajo' ? '#FB7185' : '#7AE7FF';
        return <circle key={d.key} cx={p.x} cy={p.y} r={3} fill={color} />;
      })}
    </svg>
  );
}
