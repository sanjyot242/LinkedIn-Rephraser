import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': process.env,
  },

  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'index.html'), // React popup
        content: resolve(__dirname, 'src/content.js'), // Content script
        background: resolve(__dirname, 'src/background.js'), // Background script
      },
      output: {
        entryFileNames: '[name].js', // Ensures content.js and background.js are in dist/
      },
    },
  },
});
