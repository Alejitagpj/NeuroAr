// Fallback estático (sin WebGL): cerebro estilizado en SVG con nodos brillando.
// Garantiza que el hero nunca se rompe aunque falle el 3D.
export function BrainFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <svg viewBox="0 0 240 200" className="h-full max-h-[420px] w-auto animate-pulse-slow">
        <defs>
          <radialGradient id="glow" cx="50%" cy="45%" r="60%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="120" cy="95" r="92" fill="url(#glow)" />
        {/* hemisferios */}
        <g fill="none" stroke="#38bdf8" strokeWidth="1.4" opacity="0.8">
          <path d="M118 30 C70 28 44 64 50 100 C42 130 70 162 110 158 C116 120 116 70 118 30 Z" />
          <path d="M122 30 C170 28 196 64 190 100 C198 130 170 162 130 158 C124 120 124 70 122 30 Z" />
          <path d="M118 60 C95 64 88 84 100 96" />
          <path d="M122 60 C145 64 152 84 140 96" />
          <path d="M110 110 C96 118 96 134 112 140" />
          <path d="M130 110 C144 118 144 134 128 140" />
        </g>
        {/* nodos */}
        {[
          [70, 70], [95, 55], [120, 45], [150, 58], [172, 76],
          [60, 110], [92, 100], [120, 96], [150, 102], [182, 112],
          [82, 140], [120, 150], [158, 142],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="3.2" fill="#7dd3fc">
            <animate attributeName="opacity" values="0.4;1;0.4" dur={`${2 + (i % 4) * 0.4}s`} repeatCount="indefinite" />
          </circle>
        ))}
      </svg>
    </div>
  );
}
