import { Chain } from '@sequel/types';

import { DogecoinApi } from '../index.js';

import { BaseUTXOToolbox } from './BaseUTXOToolbox.js';

export const DOGEToolbox = (apiKey?: string, apiClientOrUrl?: DogecoinApi | string) =>
  BaseUTXOToolbox({
    chain: Chain.Doge,
    apiClient:
      apiClientOrUrl && typeof apiClientOrUrl !== 'string'
        ? apiClientOrUrl
        : new DogecoinApi({
            apiKey,
            nodeUrl: apiClientOrUrl || 'https://node-router.thorswap.net/dogecoin',
            chain: Chain.Doge,
          }),
  });
