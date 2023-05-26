import { JsonRpcProvider } from '@ethersproject/providers';
import { ChainToRPC, EVMChain } from '@sequelfinance/types';

export const getProvider = (chain: EVMChain, customUrl?: string) => {
  return new JsonRpcProvider(customUrl || ChainToRPC[chain]);
};
