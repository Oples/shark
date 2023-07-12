/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_APP_TITLE: string
    // more env variables...
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}

declare const __DEV__: boolean
declare const __BUILD_TIME__: string
declare const __BUILD_VERSION__: string
