/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0', // Allow external connections in Docker
    proxy: {
      '/chathub': 'http://backend:5152',
      '/api': 'http://backend:5152',
    },
    watch: {
      usePolling: true, // Enable polling for file changes
    },
  }
});