import { JsonRpcProvider } from '@ethersproject/providers';
import { EVMChain, RPCUrlForChain } from '@sequel/types';

export const getProvider = (chain: EVMChain) => {
  return new JsonRpcProvider(RPCUrlForChain[chain]);
};
