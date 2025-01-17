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
        '@ethersproject/abstract-provider',
        '@ethersproject/bignumber',
        '@ethersproject/contracts',
        '@ethersproject/providers',
        '@sequelfinance/toolbox-cosmos',
        '@sequelfinance/toolbox-evm',
        '@sequelfinance/toolbox-utxo',
        'bitcoinjs-lib',
        'bip39',
      ],
    },
  },
});

export default viteConfig;
