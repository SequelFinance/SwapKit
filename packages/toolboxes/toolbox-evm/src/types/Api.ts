import { Balance } from '@sequelfinance/types';

export interface EvmApi<P> {
  getBalance(params: P): Promise<Balance[]>;
}
