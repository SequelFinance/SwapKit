import { Provider } from '@ethersproject/abstract-provider';
import { Signer } from '@ethersproject/abstract-signer';
import { BigNumber, BigNumberish } from '@ethersproject/bignumber';
import { hexlify } from '@ethersproject/bytes';
import { Web3Provider } from '@ethersproject/providers';
import { toUtf8Bytes } from '@ethersproject/strings';
import { baseAmount } from '@sequelfinance/helpers';
import { AssetEntity, getSignatureAssetFor } from '@sequelfinance/swapkit-entities';
import {
  Address,
  BaseDecimal,
  Chain,
  ChainId,
  ContractAddress,
  EIP1559TxParams,
  erc20ABI,
  EVMChain,
  FeeOption,
  RPCUrl,
  TxHistoryParams,
} from '@sequelfinance/types';

import { ApproveParams, BaseEVMToolbox, CovalentApi, TransferParams } from '../index.js';

import { getAssetEntity, getTokenAddress, isWeb3Provider, MAX_APPROVAL } from './BaseEVMToolbox.js';

const BSC_CHAIN_ID = ChainId.BinanceSmartChain;

export const getBalance = async (
  provider: Provider,
  api: CovalentApi,
  address: Address,
  assets?: AssetEntity[],
) => {
  const tokenBalances = await api.getBalance({
    address: address,
    chainId: BSC_CHAIN_ID,
  });

  const evmGasTokenBalance: BigNumber = await provider.getBalance(address);
  const evmGasTokenBalanceAmount = baseAmount(evmGasTokenBalance, BaseDecimal.ETH);

  if (assets) {
    return tokenBalances.filter((balance) =>
      assets.find(
        (asset) => asset.chain === balance.asset.chain && asset.symbol === balance.asset.symbol,
      ),
    );
  }
  return [
    { asset: getSignatureAssetFor(Chain.BinanceSmartChain), amount: evmGasTokenBalanceAmount },
    ...tokenBalances,
  ];
};

export const getTransactions = async (api: CovalentApi, params?: TxHistoryParams) => {
  if (!params?.address) throw new Error('address is required');
  const transactions = await api.getTransactionsForAddress({
    address: params.address,
    chainId: BSC_CHAIN_ID,
  });
  return transactions;
};

export const getTransactionData = async (api: CovalentApi, txHash: string) =>
  api.getTxInfo({ txHash, chainId: BSC_CHAIN_ID });

export const getNetworkParams = () => ({
  chainId: BSC_CHAIN_ID,
  chainName: 'BNB Smart Chain',
  nativeCurrency: {
    name: 'Binance Coin',
    symbol: 'BNB',
    decimals: 18,
  },
  rpcUrls: [RPCUrl.BinanceSmartChain],
  blockExplorerUrls: ['https://bscscan.com/'],
});

export const BSCToolbox = ({
  provider,
  signer,
  covalentApiKey,
}: {
  covalentApiKey: string;
  signer: Signer;
  provider: Provider | Web3Provider;
}) => {
  const api = new CovalentApi({ apiKey: covalentApiKey });

  const baseToolbox = BaseEVMToolbox({ provider, signer });

  const estimateGasPrices = async (provider: Provider) => {
    try {
      const gasPrice = await provider.getGasPrice();

      if (!gasPrice) throw new Error('No fee data available');

      return {
        [FeeOption.Average]: {
          gasPrice: baseAmount(gasPrice, BaseDecimal.ETH),
        },
        [FeeOption.Fast]: {
          gasPrice: baseAmount(gasPrice.mul(3).div(2), BaseDecimal.ETH),
        },
        [FeeOption.Fastest]: {
          gasPrice: baseAmount(gasPrice.mul(2), BaseDecimal.ETH),
        },
      };
    } catch (error) {
      throw new Error(
        `Failed to estimate gas price: ${(error as any).msg ?? (error as any).toString()}`,
      );
    }
  };

  const approve = async (
    provider: Provider,
    {
      assetAddress,
      spenderAddress,
      feeOptionKey = FeeOption.Fastest,
      amount,
      walletIndex = 0,
      gasLimitFallback,
      from,
      nonce,
    }: ApproveParams,
    signer?: Signer,
  ) => {
    const { gasPrice } = (await estimateGasPrices(provider))[feeOptionKey];

    const funcParams = [spenderAddress, amount?.amount() || MAX_APPROVAL, { from }];

    const functionCallParams = {
      walletIndex,
      contractAddress: assetAddress,
      abi: erc20ABI,
      funcName: 'approve',
      funcParams,
      signer,
    };

    const gasLimit = await baseToolbox
      .estimateCall(functionCallParams)
      .catch(() => BigNumber.from(gasLimitFallback));

    if (isWeb3Provider(provider)) {
      return await baseToolbox.EIP1193SendTransaction(
        await baseToolbox.createContractTxObject(functionCallParams),
      );
    }

    return baseToolbox.call({
      ...functionCallParams,
      funcParams: [
        ...funcParams.slice(0, funcParams.length - 1),
        {
          from,
          gasPrice,
          gasLimit,
          nonce,
        },
      ],
    });
  };

  const transfer = async (
    provider: Provider | Web3Provider,
    {
      asset,
      memo,
      amount,
      recipient,
      feeOptionKey = FeeOption.Fast,
      gasLimit,
      gasPrice,
      data,
      from,
      nonce,
    }: TransferParams,
    signer?: Signer,
  ) => {
    if (!signer) throw new Error('Signer is not defined');
    // TODO: create a method that creates the base tx object! @towan
    const txAmount = amount.amount();
    const parsedAsset: AssetEntity = getAssetEntity(asset);
    const chain = parsedAsset.L1Chain as EVMChain;
    const chainId = (await provider.getNetwork()).chainId;
    const assetAddress = getTokenAddress(parsedAsset, chain);
    const isGasAddress = assetAddress === ContractAddress[chain];
    const gasFees = (await estimateGasPrices(provider))[feeOptionKey];
    const overrides = {
      gasLimit:
        gasLimit || (await baseToolbox.estimateGasLimit({ asset, recipient, amount, memo, from })),
      gasPrice: gasPrice || gasFees.gasPrice,
      nonce: nonce || (await provider.getTransactionCount(from)),
      from,
    };

    if (assetAddress && !isGasAddress) {
      // Transfer ERC20
      return baseToolbox.call({
        contractAddress: assetAddress,
        abi: erc20ABI,
        funcName: 'transfer',
        funcParams: [recipient, txAmount, overrides],
      });
    }

    // Transfer ETH
    const txObject = {
      to: recipient,
      value: txAmount,
      chainId,
      data: data || (memo ? hexlify(toUtf8Bytes(memo)) : undefined),
      ...overrides,
    };

    return baseToolbox.sendTransaction(txObject, feeOptionKey);
  };

  const sendTransaction = async (
    provider: Provider,
    tx: EIP1559TxParams & { gasPrice: BigNumberish },
    feeOptionKey: FeeOption = FeeOption.Fast,
    signer?: Signer,
  ) => {
    if (!signer) throw new Error('Signer not defined');
    const address = tx.from || (await signer.getAddress());
    const nonce = tx.nonce || (await provider.getTransactionCount(address));
    const chainId = (await provider.getNetwork()).chainId;

    const { gasPrice } = tx;
    const feeData = (await estimateGasPrices(provider))[feeOptionKey];

    let gasLimit: BigNumber;
    try {
      gasLimit = tx.gasLimit
        ? BigNumber.from(tx.gasLimit)
        : (await provider.estimateGas(tx)).mul(110).div(100);
    } catch (error) {
      throw new Error(`Error estimating gas limit: ${JSON.stringify(error)}`);
    }
    try {
      const { value, ...transaction } = tx;
      const txObject = {
        ...transaction,
        chainId,
        gasPrice: BigNumber.from(gasPrice || feeData.gasPrice).toHexString(),
        gasLimit: gasLimit.toHexString(),
        nonce,
        ...(value && !BigNumber.from(value).isZero() ? { value } : {}),
      };

      if (isWeb3Provider(provider)) {
        return await baseToolbox.EIP1193SendTransaction(txObject);
      }

      const txHex = await signer.signTransaction(txObject);
      const response = await provider.sendTransaction(txHex);

      return typeof response?.hash === 'string' ? response.hash : response;
    } catch (error) {
      throw new Error(`Error sending transaction: ${JSON.stringify(error)}`);
    }
  };

  return {
    ...baseToolbox,
    estimateGasPrices: () => estimateGasPrices(provider),
    transfer: (params: TransferParams) => transfer(provider, params, signer),
    approve: (params: ApproveParams) => approve(provider, params, signer),
    sendTransaction: (tx: EIP1559TxParams & { gasPrice: BigNumberish }, feeOptionKey: FeeOption) =>
      sendTransaction(provider, tx, feeOptionKey, signer),
    getTransactionData: (txId: string) => getTransactionData(api, txId),
    getTransactions: (params?: TxHistoryParams) => getTransactions(api, params),
    getNetworkParams,
    getBalance: (address: string, assets?: AssetEntity[]) =>
      getBalance(provider, api, address, assets),
  };
};
