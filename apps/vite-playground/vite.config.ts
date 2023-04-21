import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  // NOTE: Have to be added to fix: Uncaught ReferenceError: process is not defined
  define: {
    'process.env': {},
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@sequelfinance/keystore': resolve('../../packages/keystore/src'),
      '@sequelfinance/ledger': resolve('../../packages/ledger/src'),
      '@sequelfinance/swapkit-core': resolve('../../packages/swapkit-core/src'),
      '@sequelfinance/swapkit-entities': resolve('../../packages/swapkit-entities/src'),
      '@sequelfinance/swapkit-explorers': resolve('../../packages/swapkit-explorers/src'),
      '@sequelfinance/toolbox-evm': resolve('../../packages/toolbox-evm/src'),
      '@sequelfinance/toolbox-cosmos': resolve('../../packages/toolbox-cosmos/src'),
      '@sequelfinance/toolbox-utxo': resolve('../../packages/toolbox-utxo/src'),
      '@sequelfinance/types': resolve('../../packages/types/src'),
      '@sequelfinance/walletconnect': resolve('../../packages/walletconnect/src'),
      '@sequelfinance/web-extensions': resolve('../../packages/web-extensions/src'),
    },
  },
  server: {
    port: 3000,
  },

  // NOTE: Have to be added to fix: Uncaught ReferenceError: global is not defined
  optimizeDeps: {
    esbuildOptions: {
      define: { global: 'globalThis' },
    },
  },
});
