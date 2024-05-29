/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly DEV_UNSAFE_AS_TRUE: true;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface ImportAttributes {
  type: 'macro';
}
