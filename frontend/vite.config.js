import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  //change port for production

  // for dev
  server: {
    port: 8080,
    port: 3001,
  },
});
