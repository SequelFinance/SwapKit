import { QuoteRoute } from '@sequelfinance/swapkit-api';
import { AssetAmount, SwapKitCore } from '@sequelfinance/swapkit-core';
import { FeeOption } from '@sequelfinance/types';
import { useCallback } from 'react';

import { SwapInputs } from './SwapInputs';

export default function Swap({
  inputAsset,
  outputAsset,
  skClient,
}: {
  inputAsset?: AssetAmount;
  outputAsset?: AssetAmount;
  skClient?: SwapKitCore;
}) {
  const handleSwap = useCallback(
    async (route: QuoteRoute) => {
      const inputChain = inputAsset?.asset.L1Chain;
      const outputChain = outputAsset?.asset.L1Chain;
      if (!outputChain || !inputChain || !skClient) return;

      const address = skClient.getAddress(outputChain);

      const txHash = await skClient.swap({
        route,
        recipient: address,
        feeOptionKey: FeeOption.Fast,
      });

      window.open(skClient.getExplorerTxUrl(inputChain, txHash as string), '_blank');
    },
    [inputAsset?.asset.L1Chain, outputAsset?.asset.L1Chain, skClient],
  );

  return (
    <>
      <h4>Swap</h4>
      <SwapInputs
        handleSwap={handleSwap}
        inputAsset={inputAsset}
        outputAsset={outputAsset}
        skClient={skClient}
      />
    </>
  );
}
