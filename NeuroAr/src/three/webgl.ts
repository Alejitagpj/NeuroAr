// Detección de soporte WebGL para decidir entre el cerebro 3D y el fallback estático.
let cached: boolean | null = null;

export function hasWebGL(): boolean {
  if (cached !== null) return cached;
  try {
    const canvas = document.createElement("canvas");
    cached = Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    cached = false;
  }
  return cached;
}
