import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

const publicBackendUrl = process.env.VITE_SUPABASE_URL ?? "https://haafpznzuazanylcelse.supabase.co";
const publicBackendKey =
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhYWZwem56dWF6YW55bGNlbHNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyNDk2MTYsImV4cCI6MjA4NzgyNTYxNn0.Fx2Fxcu1zGUXUVQ6lngLrhlA_uVyvLr1PmPjjsS4Cw0";
const publicBackendProjectId = process.env.VITE_SUPABASE_PROJECT_ID ?? "haafpznzuazanylcelse";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  define: {
    "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(publicBackendUrl),
    "import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY": JSON.stringify(publicBackendKey),
    "import.meta.env.VITE_SUPABASE_PROJECT_ID": JSON.stringify(publicBackendProjectId),
  },
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime"],
  },
}));
