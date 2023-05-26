import thorswapViteConfig from '@internal/config';
import { resolve } from 'path';

import { name } from './package.json';

const viteConfig = thorswapViteConfig(name, {
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
    },
    rollupOptions: {
      external: [
        '@ethersproject/bignumber',
        '@ethersproject/providers',
        '@sequelfinance/toolbox-cosmos',
        '@sequel/toolbox-evm',
        '@sequelfinance/toolbox-utxo',
      ],
    },
  },
});

export default viteConfig;
