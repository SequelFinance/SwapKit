import thorswapViteConfig from '@internal/config';
import path from 'path';

import packageJson from './package.json';

const viteConfig = thorswapViteConfig(packageJson.name, {
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
    },
  },
  rollupOptions: {
    external: ['@binance-chain/javascript-sdk', '@cosmos-client/core'],
  },
});

export default viteConfig;