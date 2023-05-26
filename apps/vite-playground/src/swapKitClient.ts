import { evmWallet } from '@sequelfinance/evm-web3-wallets';
import { keplrWallet } from '@sequelfinance/keplr';
import { keystoreWallet } from '@sequelfinance/keystore';
import { ledgerWallet } from '@sequelfinance/ledger';
import { SwapKitCore } from '@sequelfinance/swapkit-core';
import { trezorWallet } from '@sequelfinance/trezor';
import { xdefiWallet } from '@sequelfinance/xdefi';

export const getSwapKitClient = ({
  ethplorerApiKey = 'freekey',
  covalentApiKey = '',
  utxoApiKey = '',
  stagenet,
}: {
  ethplorerApiKey?: string;
  covalentApiKey?: string;
  utxoApiKey?: string;
  stagenet?: boolean;
} = {}) => {
  const client = new SwapKitCore({ stagenet });

  client.extend({
    config: { ethplorerApiKey, covalentApiKey, utxoApiKey },
    wallets: [xdefiWallet, ledgerWallet, keystoreWallet, trezorWallet, keplrWallet, evmWallet],
  });

  return client;
};
