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
        '@cosmos-client/core',
        '@ethersproject/abstract-signer',
        '@ethersproject/bignumber',
        '@ethersproject/bytes',
        '@ethersproject/contracts',
        '@ethersproject/properties',
        '@ethersproject/providers',
        '@ethersproject/transactions',
        '@sequelfinance/toolbox-cosmos',
        '@sequelfinance/toolbox-evm',
        '@sequelfinance//toolbox-utxo',
        'bitcoinjs-lib',
        'coininfo',
        'cosmos-client',
        'crypto',
        'elliptic',
      ],
    },
  },
});

export default viteConfig;
