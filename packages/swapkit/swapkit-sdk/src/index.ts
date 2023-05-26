import { SwapKitCore } from '@sequelfinance/swapkit-core';
import { ExtendParams } from '@sequelfinance/types';

export * from '@sequelfinance/swapkit-core';

type SwapKitOptions = Omit<ExtendParams, 'wallets'> & {
  swapkitConfig?: {
    stagenet?: boolean;
  };
};

export const createSwapKit = async ({ swapkitConfig, ...extendParams }: SwapKitOptions = {}) => {
  const { evmWallet } = await import('@sequelfinance/evm-web3-wallets');
  const { keplrWallet } = await import('@sequelfinance/keplr');
  const { keystoreWallet } = await import('@sequelfinance/keystore');
  const { ledgerWallet } = await import('@sequelfinance/ledger');
  const { trezorWallet } = await import('@sequelfinance/trezor');
  const { trustwalletWallet } = await import('@sequelfinance/trustwallet');
  const { xdefiWallet } = await import('@sequelfinance/xdefi');

  const swapKitClient = new SwapKitCore(swapkitConfig);

  swapKitClient.extend({
    ...extendParams,
    wallets: [
      evmWallet,
      keystoreWallet,
      ledgerWallet,
      trezorWallet,
      trustwalletWallet,
      keplrWallet,
      xdefiWallet,
    ],
  });

  return swapKitClient;
};
