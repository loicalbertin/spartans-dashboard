import BigNumber from 'bignumber.js';
import { NFTConfig } from 'config/SpartanNFTsConfig';
import { makeAutoObservable } from 'mobx';

export class NFTState {
  tokenId: BigNumber;
  config: NFTConfig;
  constructor(args: Partial<NFTState>) {
    Object.assign(this, args);
    makeAutoObservable(this);
  }
}
