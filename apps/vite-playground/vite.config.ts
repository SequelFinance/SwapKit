import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  // NOTE: Have to be added to fix: Uncaught ReferenceError: process & global is not defined
  define: {
    'process.env': {},
    'process.version': JSON.stringify('v18.16.0'),
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@sequelfinance/keystore': resolve('../../packages/wallets/keystore/src'),
      '@sequelfinance/ledger': resolve('../../packages/wallets/ledger/src'),
      '@sequelfinance/swapkit-core': resolve('../../packages/swapkit/swapkit-core/src'),
      '@sequelfinance/swapkit-entities': resolve('../../packages/swapkit/swapkit-entities/src'),
      '@sequelfinance/swapkit-explorers': resolve('../../packages/swapkit/swapkit-explorers/src'),
      '@sequelfinance/toolbox-evm': resolve('../../packages/toolboxes/toolbox-evm/src'),
      '@sequelfinance/toolbox-cosmos': resolve('../../packages/toolboxes/toolbox-cosmos/src'),
      '@sequelfinance/toolbox-utxo': resolve('../../packages/toolboxes/toolbox-utxo/src'),
      '@sequelfinance/types': resolve('../../packages/swapkit/types/src'),
      '@sequelfinance/trustwallet': resolve('../../packages/wallets/trustwallet/src'),
      '@sequelfinance/trezor': resolve('../../packages/wallets/trezor/src'),
      '@sequelfinance/xdefi': resolve('../../packages/wallets/xdefi/src'),

      crypto: resolve('node_modules/crypto-browserify'),
      http: 'stream-http',
      https: 'https-browserify',
      os: 'os-browserify/browser',
      stream: 'readable-stream',
      util: 'util',
      url: 'url',
    },
  },
  server: {
    port: 3000,
  },
  base: '/SwapKit/',

  build: {
    target: 'es2020',
    reportCompressedSize: true,
    sourcemap: true,
    rollupOptions: {
      plugins: [nodePolyfills({ sourceMap: true })],
      output: { sourcemap: true },
    },
  },

  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020',
      // NOTE: Have to be added to fix: Uncaught ReferenceError: global is not defined
      define: { global: 'globalThis' },
    },
  },
});
