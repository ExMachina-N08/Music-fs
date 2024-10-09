import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    chunkSizeWarningLimit: 2000, // Increase if you have large bundles
    rollupOptions: {
      maxParallelFileOps: 2, // Reduce memory usage by limiting parallel file operations
    },
  },
  server: {
    port: 3001,
  },
  optimizeDeps: {
    include: [], // Pre-bundle specific dependencies if needed
  },
});
