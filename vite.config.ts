import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Served from the domain root on Vercel, so assets resolve under "/".
export default defineConfig({
  plugins: [react()],
});
