import { SwapKitCore } from '@sequelfinance/swapkit-core';
import { Platform } from 'react-native';

let skClient: SwapKitCore;

export const getSwapKitClient = () => {
  if (skClient) return skClient;

  const client = new SwapKitCore();

  const wallets = Platform.select({
    default: [require('@sequelfinance/keystore').keystoreWallet],
    web: [
      require('@sequelfinance/keystore').keystoreWallet,
      require('@sequelfinance/xdefi').xdefiWallet,
      require('@sequelfinance/walletconnect').walletconnectWallet,
      require('@sequelfinance/trustwallet').trustwalletWallet,
    ],
  });

  client.extend({
    config: {
      ethplorerApiKey: 'freekey',
      covalentApiKey: 'freekey',
      utxoApiKey: 'freekey',
    },
    wallets,
  });

  skClient = client;

  return client;
};
