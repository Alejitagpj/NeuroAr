import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React runtime
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          // 3D / WebGL (heavy — only loaded on patient pages with brain)
          "vendor-three": ["three", "@react-three/fiber", "@react-three/drei"],
          // Charts (only loaded in AnalysisPanel tabs)
          "vendor-recharts": ["recharts"],
          // PDF renderer (only loaded on user click)
          "vendor-pdf": ["@react-pdf/renderer"],
        },
      },
    },
  },
});
