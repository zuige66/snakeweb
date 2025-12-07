import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Fix: Cast process to any to resolve "Property 'cwd' does not exist on type 'Process'" error
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    // IMPORTANT: specific for GitHub Pages or relative hosting
    base: './', 
    define: {
      // Polyfill process.env.API_KEY for compatibility with the existing code
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  };
});