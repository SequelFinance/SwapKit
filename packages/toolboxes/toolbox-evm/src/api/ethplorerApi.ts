import { getAddress } from '@ethersproject/address';
import { assetFromString, baseAmount, getRequest } from '@sequelfinance/helpers';
import { Balance, Chain } from '@sequelfinance/types';

import { AddressInfo } from '../types/index.js';

const baseUrl = 'https://api.ethplorer.io';

export const ethplorerApi = (apiKey = 'freekey') => ({
  getBalance: async (address: string) => {
    const { tokens } = await getRequest<AddressInfo>(`${baseUrl}/getAddressInfo/${address}`, {
      apiKey,
    });

    return tokens
      ? tokens.reduce((acc, token) => {
          const { symbol, decimals, address } = token.tokenInfo;
          const tokenAsset = assetFromString(`${Chain.Ethereum}.${symbol}-${getAddress(address)}`);
          if (tokenAsset) {
            return [
              ...acc,
              { asset: tokenAsset, amount: baseAmount(token.rawBalance, parseInt(decimals)) },
            ];
          }
          return acc;
        }, [] as Balance[])
      : [];
  },
});

export type EthplorerApiType = ReturnType<typeof ethplorerApi>;
