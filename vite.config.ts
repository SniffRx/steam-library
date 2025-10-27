import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: true
        }),
        react(),
        tailwindcss()
    ],
    // server: {
    //     host: '0.0.0.0',
    //     port: 5173,
    //     cors: {
    //         origin: 'http://192.168.1.141:8000', // ваш IP и порт Laravel
    //         // или origin: '*' для разработки, но менее безопасно
    //         methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    //         allowedHeaders: ['*'],
    //         credentials: true,
    //     },
    //     hmr: {
    //         host: '192.168.1.141', // IP сервера для hot reload
    //         protocol: 'ws',
    //         port: 5173,
    //     },
    // },
    build: {
        outDir: 'public/build', // 👈 это важно для Laravel
        emptyOutDir: true
    },
    esbuild: {
        jsx: 'automatic'
    },
    resolve: {
        alias: {
            'ziggy-js': resolve(__dirname, 'vendor/tightenco/ziggy')
        }
    }
});
