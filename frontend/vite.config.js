import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  //change port for production
  build: {
    outDir: "dist", // This is where the static files will be output
  },
  // for dev
  server: {
    port: 3001,
  },
});
