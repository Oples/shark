/// <reference types="vite/client" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
process.env = { ...process.env, ...import.meta.env }

export default defineConfig({
    plugins: [react()],
    define: {
        __DEV__: process.env.NODE_ENV === 'development',
        __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
        __BUILD_VERSION__: JSON.stringify(process.env.npm_package_version),
    },
})
