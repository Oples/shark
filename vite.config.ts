/// <reference types="vite/client" />
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
process.env = { ...process.env, ...import.meta.env }

export default defineConfig({
    plugins: [react()],
    define: {
        __DEV__: process.env.NODE_ENV === 'development',
        __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
        __BUILD_VERSION__: JSON.stringify(process.env.npm_package_version),
        __BACKEND_ADDRESS__: JSON.stringify(process.env.VITE_BACKEND_ADDRESS),
    },
})
