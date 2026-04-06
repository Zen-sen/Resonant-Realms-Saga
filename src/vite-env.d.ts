/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DIAMOND_ADDRESS: string;
  readonly VITE_NETWORK: string;
  readonly VITE_CHAIN_ID: string;
  readonly VITE_PI_TESTNET_RPC: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
