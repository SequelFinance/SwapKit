import { AssetAmount, Percent, Pool } from '@sequelfinance/swapkit-entities';
import {
  BinanceToolbox,
  DepositParam,
  GaiaToolbox,
  ThorchainToolboxType,
} from '@sequelfinance/toolbox-cosmos';
import { AVAXToolbox, BSCToolbox, ETHToolbox } from '@sequelfinance/toolbox-evm';
import { BCHToolbox, BTCToolbox, DOGEToolbox, LTCToolbox } from '@sequelfinance/toolbox-utxo';
import {
  AmountWithBaseDenom,
  Chain,
  FeeOption,
  SupportedChain,
  TxHash,
  TxParams,
  WalletOption,
} from '@sequelfinance/types';
import { QuoteRoute } from '@thorswap-lib/cross-chain-api-sdk/lib/entities';

export type { TransactionDetails } from '@thorswap-lib/cross-chain-api-sdk';
export type {
  Calldata,
  CalldataSwapIn,
  CalldataSwapOut,
  CalldataTcToTc,
  Provider,
  Quote,
  QuoteMeta,
  QuoteRoute,
  QuoteSwap,
  Token,
  TokenList,
} from '@thorswap-lib/cross-chain-api-sdk/lib/entities';

export type CoreTxParams = {
  assetAmount: AssetAmount;
  recipient: string;
  memo?: string;
  feeOptionKey?: FeeOption;
  feeRate?: number;
  data?: string;
  from?: string;
};

export type AddLiquidityParams = {
  pool: Pool;
  isPendingSymmAsset?: boolean;
  runeAmount?: AssetAmount;
  assetAmount?: AssetAmount;
  runeAddr?: string;
  assetAddr?: string;
  mode?: LPType;
};

export type CreateLiquidityParams = {
  runeAmount: AssetAmount;
  assetAmount: AssetAmount;
};

export type AddLiquidityTxns = {
  runeTx?: TxHash;
  assetTx?: TxHash;
};

type LPType = 'sym' | 'rune' | 'asset';
export type WithdrawParams = {
  pool: Pool;
  percent: Percent;
  from: LPType;
  to: LPType;
};

export type UpgradeParams = {
  runeAmount: AssetAmount;
  recipient: string;
};

export type ChainWallet = {
  address: string;
  balance: AssetAmount[];
  walletType: WalletOption;
};

type ParamsWithChain<T> = T & { chain: SupportedChain };
export type AddChainWalletParams = ParamsWithChain<{
  wallet: ChainWallet;
  walletMethods: any;
}>;

export type Wallet = Record<SupportedChain, ChainWallet | null>;

export type BaseWalletMethods = {
  getAddress: () => Promise<string> | string;
};

export type ThorchainWallet = BaseWalletMethods &
  ThorchainToolboxType & {
    transfer: (params: TxParams) => Promise<string>;
    deposit: (params: DepositParam) => Promise<string>;
  };

export type CosmosBasedWallet<T extends typeof BinanceToolbox | typeof GaiaToolbox> =
  BaseWalletMethods &
    ReturnType<T> & {
      transfer: (params: TxParams) => Promise<string>;
    };

export type EVMWallet<T extends typeof AVAXToolbox | typeof BSCToolbox | typeof ETHToolbox> =
  BaseWalletMethods &
    ReturnType<T> & {
      transfer: (params: TxParams) => Promise<string>;
    };

export type UTXOWallet<
  T extends typeof BCHToolbox | typeof BTCToolbox | typeof DOGEToolbox | typeof LTCToolbox,
> = BaseWalletMethods &
  ReturnType<T> & {
    transfer: (prams: TxParams) => Promise<string>;
  };

export type WalletMethods = {
  [Chain.Avalanche]: EVMWallet<typeof AVAXToolbox> | null;
  [Chain.BinanceSmartChain]: EVMWallet<typeof BSCToolbox> | null;
  [Chain.Binance]: CosmosBasedWallet<typeof BinanceToolbox> | null;
  [Chain.BitcoinCash]: UTXOWallet<typeof BCHToolbox> | null;
  [Chain.Bitcoin]: UTXOWallet<typeof BTCToolbox> | null;
  [Chain.Cosmos]: CosmosBasedWallet<typeof GaiaToolbox> | null;
  [Chain.Doge]: UTXOWallet<typeof DOGEToolbox> | null;
  [Chain.Ethereum]: EVMWallet<typeof ETHToolbox> | null;
  [Chain.Litecoin]: UTXOWallet<typeof LTCToolbox> | null;
  [Chain.THORChain]: ThorchainWallet | null;
};

export enum QuoteMode {
  TC_SUPPORTED_TO_TC_SUPPORTED = 'TC-TC',
  ETH_TO_TC_SUPPORTED = 'ERC20-TC',
  TC_SUPPORTED_TO_ETH = 'TC-ERC20',
  ETH_TO_ETH = 'ERC20-ERC20',
  AVAX_TO_AVAX = 'ARC20-ARC20',
  AVAX_TO_TC_SUPPORTED = 'ARC20-TC',
  TC_SUPPORTED_TO_AVAX = 'TC-ARC20',
  AVAX_TO_ETH = 'ARC20-ERC20',
  ETH_TO_AVAX = 'ERC20-ARC20',
}

export type FeeRate = number;
export type FeeRates = Record<FeeOption, FeeRate>;

export enum FeeType {
  FlatFee = 'base',
  PerByte = 'byte',
}

export type LegacyFees = Record<FeeOption, AmountWithBaseDenom> & {
  type: FeeType;
};

type ConnectMethodNames =
  | 'connectXDEFI'
  | 'connectKeplr'
  | 'connectTrustwallet'
  | 'connectKeystore'
  | 'connectLedger'
  | 'connectTrezor'
  | 'connectEVMWallet';

type ConnectConfig = {
  stagenet?: boolean;
  /**
   * @required for AVAX & BSC
   */
  covalentApiKey?: string;
  /**
   * @required for ETH
   */
  ethplorerApiKey?: string;
  /**
   * @required for BTC, LTC, DOGE & BCH
   */
  utxoApiKey?: string;
};

export type ExtendParams = {
  excludedChains?: Chain[];
  config?: ConnectConfig;
  wallets: {
    connectMethodName: ConnectMethodNames;
    connect: (params: {
      addChain: (params: AddChainWalletParams) => void;
      config: ConnectConfig;
    }) => (...params: any) => Promise<any>;
  }[];
};

export type SwapParams = {
  recipient: string;
  route: QuoteRoute;
  feeOptionKey: FeeOption;
};
