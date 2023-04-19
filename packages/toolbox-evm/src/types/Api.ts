import { Balance, Tx, TxsPage } from '@sequelfinance/types';

export interface EvmApi<P> {
  getTxInfo(params: P): Promise<Tx>;
  getTransactionsForAddress(params: P): Promise<TxsPage>;
  getBalance(params: P): Promise<Balance[]>;
}
