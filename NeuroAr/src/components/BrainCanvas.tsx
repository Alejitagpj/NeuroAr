import { Suspense, lazy } from "react";
import { hasWebGL } from "../three/webgl";
import { BrainFallback } from "./BrainFallback";
import type { DomainRange } from "../three/brainGeometry";

// Carga diferida del 3D para no inflar el arranque. Si no hay WebGL → fallback SVG.
const Brain3D = lazy(() => import("../three/Brain3D"));

type Props = {
  ranges?: Record<string, DomainRange>;
  activeDomain?: string | null;
  onRegionClick?: (domain: string) => void;
  interactive?: boolean;
  className?: string;
};

export function BrainCanvas({ className, ...props }: Props) {
  const webgl = hasWebGL();
  return (
    <div className={className}>
      {webgl ? (
        <Suspense fallback={<BrainFallback />}>
          <Brain3D {...props} />
        </Suspense>
      ) : (
        <BrainFallback />
      )}
    </div>
  );
}
