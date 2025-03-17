import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // Allows access from outside the container
    port: 5173, // Ensure it matches docker-compose
    strictPort: true,
    watch: {
      usePolling: true, // Ensures hot reload works properly in Docker
    },
  },
});
