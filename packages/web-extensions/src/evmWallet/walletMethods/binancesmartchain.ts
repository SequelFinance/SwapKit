import { Signer } from '@ethersproject/abstract-signer';
import { Web3Provider } from '@ethersproject/providers';
import { BSCToolbox } from '@thorswap-lib/toolbox-evm';
import { ChainId } from '@thorswap-lib/types';

import { prepareNetworkSwitch } from './helpers/methodWrappers.js';
import { addEVMWalletNetwork } from './helpers/networkManagement.js';

type WalletMethodParams = {
  covalentApiKey: string;
  signer: Signer;
  provider: Web3Provider;
};

export const binanceSmartChainWalletMethods = async ({
  covalentApiKey,
  signer,
  provider,
}: WalletMethodParams) => {
  const toolbox = BSCToolbox({
    provider,
    signer,
    covalentApiKey,
  });
  await addEVMWalletNetwork(
    provider.provider as unknown as typeof window.ethereum,
    toolbox.getNetworkParams(),
  );
  const from = await signer.getAddress();

  const preparedToolbox = prepareNetworkSwitch<typeof toolbox>({
    toolbox,
    chainId: ChainId.BinanceSmartChain,
    provider: provider.provider as unknown as typeof window.ethereum,
  });

  return { ...preparedToolbox, getAddress: () => from };
};