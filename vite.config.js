import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

import fs from 'fs';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  base: './',
  root: './src',
  // publicDir: '../public',
  publicDir: false,
  server: {
    port: 3003,
    open: '/popup/index.html',
    hmr: true
  },
  build: {
    outDir: path.resolve(__dirname, 'extension/dist'), // Explicit directory
    emptyOutDir: false,
    terserOptions: {
      mangle: false,
    },
    rollupOptions: {
      input: {
        popup: path.resolve(__dirname, 'src/popup/index.html'),
        options: path.resolve(__dirname, 'src/options/index.html'),
      },
    },
  },

  plugins: [
    vue(),
    vueDevTools(),
    // {
    //   name: 'clear-assets-folder',
    //   buildStart() {
    //     const assetsDir = path.resolve(__dirname, './extension/dist/assets');
    //     clearDir(assetsDir);
    //   },
    // },
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})

function clearDir(assetsDir) {
  if (fs.existsSync(assetsDir)) {
    fs.readdirSync(assetsDir).forEach((file) => {
      const filePath = path.join(assetsDir, file);
      fs.rmSync(filePath, { recursive: true, force: true });
    });
    console.log(`** Cleared: ${assetsDir}`);
  }
}
