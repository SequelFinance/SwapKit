import { Chain } from '@sequelfinance/types';

import { BitcoinApi } from '../index.js';

import { BaseUTXOToolbox } from './BaseUTXOToolbox.js';

export const BTCToolbox = (apiKey?: string, apiClientOrUrl?: BitcoinApi | string) =>
  BaseUTXOToolbox({
    chain: Chain.Bitcoin,
    apiClient:
      apiClientOrUrl && typeof apiClientOrUrl !== 'string'
        ? apiClientOrUrl
        : new BitcoinApi({
            apiKey,
            nodeUrl: apiClientOrUrl || 'https://node-router.thorswap.net/bitcoin',
            chain: Chain.Bitcoin,
          }),
  });
