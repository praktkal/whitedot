import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Project is served from https://praktkal.github.io/whitedot/, so assets
// must be referenced under the /whitedot/ base path.
export default defineConfig({
  plugins: [react()],
  base: "/whitedot/",
});
