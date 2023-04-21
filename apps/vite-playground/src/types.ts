import { SwapKitCore } from '@sequelfinance/swapkit-core';

export type WalletDataType = Awaited<
  ReturnType<InstanceType<typeof SwapKitCore>['getWalletByChain']>
>;
