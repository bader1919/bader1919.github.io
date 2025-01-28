import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: "/projects/home-assistant-optimization/", // ✅ Fix for GitHub Pages
  build: {
    outDir: "dist", // ✅ Ensures the build output goes to "dist"
  },
});
