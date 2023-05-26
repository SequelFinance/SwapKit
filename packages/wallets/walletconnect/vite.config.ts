import thorswapViteConfig from '@internal/config';
import { resolve } from 'path';

import { name } from './package.json';

const viteConfig = thorswapViteConfig(name, {
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
    },
  },
  rollupOptions: {
    external: ['@ethersproject/bytes', '@ethersproject/strings', '@sequelfinance/toolbox-evm'],
  },
});

export default viteConfig;
