import { derivationPathToString } from '@sequelfinance/helpers';
import { DerivationPathArray, NetworkDerivationPath } from '@sequelfinance/types';
import { networks } from 'bitcoinjs-lib';

import { getWalletFormatFor } from '../helpers/derivationPath.js';
import { UTXOLedgerInterface } from '../interfaces/LedgerInterfaces.js';

export class BitcoinLedger extends UTXOLedgerInterface {
  constructor(derivationPath: DerivationPathArray = NetworkDerivationPath.BTC) {
    super();
    this.addressNetwork = networks.bitcoin;
    this.chain = 'btc';
    this.derivationPath = derivationPathToString(derivationPath);
    this.walletFormat = getWalletFormatFor(this.derivationPath) as 'legacy' | 'bech32';
  }
}
