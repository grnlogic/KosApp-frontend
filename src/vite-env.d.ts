/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_API_URL: string
  // add more env variables as needed
  // Allow index signature for dynamic access
  [key: string]: string | undefined
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
