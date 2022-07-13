import { makeAutoObservable } from 'mobx';
import { EthNetworkConfig } from '../config/NetworkConfig';
import { eventBus } from '../lib/event';
import { ChainState } from './lib/ChainState';
import { EthNetworkState } from './lib/EthNetworkState';
import { NetworkState } from './lib/NetworkState';
import RootStore from './root';
import { NumberState, StringState } from './standard/base';
import { MappingState } from './standard/MappingState';

export enum Network {
  BSC = 'bsc',
  FTM = 'ftm'
}

export class GodStore {
  rootStore: RootStore;
  ftmNetwork: NetworkState;
  bscNetwork: NetworkState;
  network: MappingState<NetworkState> = new MappingState({
    currentId: 'bsc',
    map: {
      bsc: EthNetworkConfig
    }
  });

  trackedWalletAddress = new StringState();

  updateTicker = new NumberState();

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this, {
      rootStore: false
    });
    EthNetworkConfig.god = this;
  }

  get eth(): EthNetworkState {
    return this.network.map.bsc as EthNetworkState;
  }

  get isConnect() {
    return !!this.currentNetwork.account;
  }
  get currentNetwork() {
    return this.network.current;
  }
  get currentChain(): ChainState {
    return this.currentNetwork.currentChain;
  }
  get Coin() {
    return this.currentChain.Coin;
  }

  setNetwork(val: Network) {
    this.network.setCurrentId(val);
  }
  setChain(val: number) {
    this.currentNetwork.chain.setCurrentId(val);
    eventBus.emit('chain.switch');
  }
  setShowConnecter(value: boolean) {
    this.eth.connector.showConnector = value;
  }

  pollingData() {
    this.updateTicker.setValue(this.updateTicker.value + 1);
  }
}
