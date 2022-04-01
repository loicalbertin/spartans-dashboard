import erc20Abi from '@/constants/abi/erc20.json';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { makeAutoObservable } from 'mobx';
import { CallParams } from '../../../type';
import { EthNetworkConfig } from '../../config/NetworkConfig';
import { BigNumberState } from '../standard/BigNumberState';
import { ReadFunction, WriteFunction } from './ContractState';
import { NetworkState } from './NetworkState';

class TokenState {
  abi = erc20Abi;
  name: string = '';
  symbol: string = '';
  address: string = '';
  logoURI: string = '';
  chainId: number = 0;
  decimals: number = 18;
  fixed: number = 6;
  numeralFormat = '';

  network: NetworkState = EthNetworkConfig;
  allowanceForRouter = new ReadFunction<[string, string], BigNumberState>({ name: 'allowance', contract: this, value: new BigNumberState({}) });

  _balance: BigNumberState;
  isNew = false;
  saved = false;
  isEther = false;
  y;
  constructor(args: Partial<TokenState>) {
    Object.assign(this, args);
    this._balance = new BigNumberState({ decimals: this.decimals, loading: true, fixed: this.fixed, numeralFormat: this.numeralFormat });
    if (this.isEther) {
      this.allowanceForRouter.value.setValue(new BigNumber(ethers.constants.MaxUint256.toString()));
    }
    makeAutoObservable(this);
  }

  setDecimals(val) {
    this.decimals = val;
    this._balance.setDecimals(val);
    this.allowanceForRouter.value.setDecimals(val);
  }

  get balance() {
    // if (this.isEther) {
    //   return rootStore.god.Coin.balance;
    // }
    return this._balance;
  }

  set balance(v) {
    this._balance = v;
  }

  // new
  transfer = new WriteFunction<[string, string]>({ name: 'transfer', contract: this });
  approve = new WriteFunction<[string, string]>({
    name: 'approve',
    contract: this,
    onAfterCall: ({ args, receipt }) => {
      if (receipt.status) {
        const amount = args.params[1];
        this.allowanceForRouter.value.setValue(new BigNumber(amount));
      }
    }
  });

  preMulticall(args: Partial<CallParams>) {
    //if (this.isEther || !this.address) return;
    return Object.assign({ address: this.address, abi: this.abi }, args);
  }
}

export default TokenState;
