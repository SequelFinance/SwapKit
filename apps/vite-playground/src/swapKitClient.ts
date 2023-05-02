import { keystoreWallet } from '@sequelfinance/keystore';
import { ledgerWallet } from '@sequelfinance/ledger';
import { SwapKitCore } from '@sequelfinance/swapkit-core';
import { trezorWallet } from '@sequelfinance/trezor';
import { evmWallet, xdefiWallet } from '@sequelfinance/web-extensions';

let skClient: SwapKitCore;

export const getSwapKitClient = () => {
  if (skClient) return skClient;

  const client = new SwapKitCore();

  client.extend({
    config: {
      ethplorerApiKey: 'freekey',
      covalentApiKey: '',
      utxoApiKey: 'freekey',
    },
    wallets: [xdefiWallet, evmWallet, ledgerWallet, keystoreWallet, trezorWallet],
  });

  skClient = client;

  return client;
};
