import { derivationPathToString } from '@sequelfinance/helpers';
import { DerivationPathArray, NetworkDerivationPath } from '@sequelfinance/types';

import { CommonLedgerInterface } from '../interfaces/LedgerInterfaces.js';

export class CosmosLedger extends CommonLedgerInterface {
  public derivationPath: string;

  constructor(derivationPath: DerivationPathArray = NetworkDerivationPath.GAIA) {
    super();
    this.chain = 'cosmos';
    this.derivationPath = derivationPathToString(derivationPath);
  }

  connect = async () => {
    await this.checkOrCreateTransportAndLedger();
    const { address } = await this.ledgerApp.getAddress(this.derivationPath, this.chain);

    return address;
  };
}
