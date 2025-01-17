import { Provider } from '@ethersproject/abstract-provider';
import { Signer } from '@ethersproject/abstract-signer';
import { BigNumber } from '@ethersproject/bignumber';
import { Web3Provider } from '@ethersproject/providers';
import { baseAmount, gasFeeMultiplier } from '@sequelfinance/helpers';
import { AssetEntity, getSignatureAssetFor } from '@sequelfinance/swapkit-entities';
import {
  Address,
  BaseDecimal,
  Chain,
  ChainId,
  FeeOption,
  TxHistoryParams,
} from '@sequelfinance/types';

import { BaseEVMToolbox, CovalentApi, FeeData, getProvider, MIN_AVAX_GAS } from '../index.js';

export const getFeeData = async ({
  feeOptionKey = FeeOption.Average,
}: {
  feeOptionKey?: FeeOption;
}): Promise<FeeData> => {
  const { Avalanche } = await import('avalanche');
  try {
    const CCClient = new Avalanche(
      undefined,
      undefined,
      undefined,
      parseInt(ChainId.Avalanche),
    ).CChain();

    const baseFee = BigNumber.from(parseInt(await CCClient.getBaseFee(), 16) / 1e9);
    const maxPriority = BigNumber.from(
      parseInt(await CCClient.getMaxPriorityFeePerGas(), 16) / 1e9,
    );
    const maxFee = BigNumber.from(maxPriority).add(baseFee);
    if (maxFee < maxPriority) {
      throw new Error('Error: Max fee per gas cannot be less than max priority fee per gas');
    }
    return {
      maxFeePerGas: baseFee.mul(Math.floor(gasFeeMultiplier[feeOptionKey] * 100)).div(100),
      maxPriorityFeePerGas: maxPriority
        .mul(Math.floor(gasFeeMultiplier[feeOptionKey] * 100))
        .div(100),
    };
  } catch (error) {
    console.info('DEFAULT GAS ESTIMATION');
    return {
      maxFeePerGas: BigNumber.from(MIN_AVAX_GAS)
        .mul(Math.floor(gasFeeMultiplier[feeOptionKey] * 100))
        .div(100),
      maxPriorityFeePerGas: BigNumber.from('1500000000')
        .mul(Math.floor(gasFeeMultiplier[feeOptionKey] * 100))
        .div(100),
    };
  }
};

export const getBalance = async (api: CovalentApi, address: Address, assets?: AssetEntity[]) => {
  const provider = getProvider(Chain.Avalanche);
  const tokenBalances = await api.getBalance({ address, chainId: ChainId.Avalanche });
  const evmGasTokenBalance = await provider.getBalance(address);
  const evmGasTokenBalanceAmount = baseAmount(evmGasTokenBalance, BaseDecimal.ETH);

  if (assets) {
    return tokenBalances.filter(({ asset }) =>
      assets.find(({ chain, symbol }) => chain === asset.chain && symbol === asset.symbol),
    );
  }

  return [
    { asset: getSignatureAssetFor(Chain.Avalanche), amount: evmGasTokenBalanceAmount },
    ...tokenBalances,
  ];
};

export const getTransactions = async (api: CovalentApi, params?: TxHistoryParams) => {
  if (!params?.address) throw new Error('address is required');
  const transactions = await api.getTransactionsForAddress({
    address: params.address,
    chainId: ChainId.Avalanche,
  });
  return transactions;
};

export const getTransactionData = async (api: CovalentApi, txHash: string) =>
  api.getTxInfo({ txHash, chainId: ChainId.Avalanche });

export const getNetworkParams = () => ({
  chainId: ChainId.AvalancheHex,
  chainName: 'Avalanche Mainnet C-Chain',
  nativeCurrency: {
    name: 'Avalanche',
    symbol: 'AVAX',
    decimals: 18,
  },
  rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
  blockExplorerUrls: ['https://snowtrace.io/'],
});

export const AVAXToolbox = ({
  provider,
  signer,
  covalentApiKey,
}: {
  covalentApiKey: string;
  signer: Signer;
  provider: Provider | Web3Provider;
}) => {
  const api = new CovalentApi({ apiKey: covalentApiKey });

  return {
    ...BaseEVMToolbox({ provider, signer }),
    getTransactionData: (txHash: string) => getTransactionData(api, txHash),
    getTransactions: (params?: TxHistoryParams) => getTransactions(api, params),
    getNetworkParams,
    getBalance: (address: string, assets?: AssetEntity[]) => getBalance(api, address, assets),
  };
};
