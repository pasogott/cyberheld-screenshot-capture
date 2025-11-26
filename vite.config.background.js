import { defineConfig } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { fileURLToPath, URL } from 'node:url'

import fs from 'fs';


export default defineConfig({
    publicDir: false,

    build: {
        outDir: path.resolve(__dirname, './extension/dist/background'), // build only content
        emptyOutDir: false,
        minify: false,  // Disable minification to prevent encoding issues
        terserOptions: {
            mangle: false,
        },
        lib: {
            entry: path.resolve(__dirname, 'src/background-script/background.js'),
            formats: ['iife'], // Chrome extensions prefer IIFE
            name: 'BackgroundScript'

        },
        rollupOptions: {
            output: {
                entryFileNames: `background.js`,
                extend: true,
                format: 'iife',
            }
        }

    },
    plugins: [
        vue(),
        vueDevTools(),

    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        },
    },
})
