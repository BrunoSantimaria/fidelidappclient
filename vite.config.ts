import { defineConfig } from "vite";
import compression from "vite-plugin-compression";
import react from "@vitejs/plugin-react-swc";
import { visualizer } from "rollup-plugin-visualizer";
import path from "path"; // Aquí importamos path

export default defineConfig({
  plugins: [
    react(),
    compression({
      algorithm: "gzip", // Opcional: 'brotliCompress' para Brotli
    }),
    visualizer({
      open: true, // Abre el visualizador en el navegador después de la compilación
      gzipSize: true, // Opcional: muestra el tamaño comprimido en lugar del tamaño sin comprimir
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // Ahora path.resolve debería funcionar
    },
  },
});
