import { Chain } from '@sequelfinance/types';

export type QuoteParams = {
  affiliateBasisPoints?: string;
  buyAsset: string;
  recipientAddress?: string;
  sellAmount: string;
  sellAsset: string;
  senderAddress?: string;
  slippage: string;
};

export type QuoteResponse = { quoteId: string; routes: QuoteRoute[] };

export type QuoteRoute = {
  path: string;
  providers: string[];
  subProviders: string[];
  swaps: Swaps;
  expectedOutput: string;
  expectedOutputMaxSlippage: string;
  expectedOutputUSD: string;
  expectedOutputMaxSlippageUSD: string;
  transaction?: any;
  optimal: boolean;
  complete: boolean;
  fees: Fees;
  meta: Meta;
  inboundAddress: string;
  targetAddress: string;
  calldata: Calldata;
  contract: string;
  contractMethod: string;
  contractInfo: string;
  index: number;
  estimatedTime: number;
};

type Calldata = {
  fromAsset: string;
  userAddress: string;
  amountIn: string;
  amountOut: string;
  amountOutMin: string;
  memo: string;
  expiration: number;
  tcVault: string;
  tcRouter: string;
};

type Meta = {
  sellChain: string;
  sellChainGasRate: string;
  buyChain: string;
  buyChainGasRate: string;
  priceProtectionRequired: boolean;
  priceProtectionDetected: boolean;
  quoteMode: string;
  lastLegEffectiveSlipPercentage: number;
  thornodeMeta?: any;
};

type SwapItem = { from: string; to: string; toTokenAddress: string; parts: Part[] };
type FeeItem = {
  type: string;
  asset: string;
  networkFee: number;
  networkFeeUSD: number;
  affiliateFee: number;
  affiliateFeeUSD: number;
  totalFee: number;
  totalFeeUSD: number;
  isOutOfPocket: boolean;
  slipFee?: number;
  slipFeeUSD?: number;
};

type Fees = { [key in Chain]: FeeItem[] };
type Part = { provider: string; percentage: number };
type Swaps = { [key: string]: SwapItem[][] };
