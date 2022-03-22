import { makeAutoObservable } from 'mobx';
import { EthNetworkConfig } from '../config/NetworkConfig';
import { eventBus } from '../lib/event';
import { ChainState } from './lib/ChainState';
import { EthNetworkState } from './lib/EthNetworkState';
import { NetworkState } from './lib/NetworkState';
import RootStore from './root';
import { NumberState } from './standard/base';
import { MappingState } from './standard/MappingState';

export enum Network {
  ETH = 'eth',
  BSC = 'bsc',
  IOTEX = 'iotex',
  POLYGON = 'polygon',
  FTM = 'ftm'
}

export class GodStore {
  rootStore: RootStore;
  ftmNetwork: NetworkState;
  bscNetwork: NetworkState;
  network: MappingState<NetworkState> = new MappingState({
    currentId: 'eth',
    map: {
      eth: EthNetworkConfig
    }
  });

  updateTicker = new NumberState();

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this, {
      rootStore: false
    });
    EthNetworkConfig.god = this;
  }
  get isIotxNetork() {
    return this.network.currentId.value == 'iotex';
  }
  get isETHNetwork() {
    //@ts-ignore
    return ['eth', 'bsc'].includes(this.network.currentId.value);
  }

  get eth(): EthNetworkState {
    return this.network.map.eth as EthNetworkState;
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
