/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_BACKEND_ADDRESS: string
    // more env variables...
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}

declare const __DEV__: boolean
declare const __BUILD_TIME__: string
declare const __BUILD_VERSION__: string
declare const __BACKEND_ADDRESS__: string
