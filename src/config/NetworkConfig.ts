import { MappingState } from '@/store/standard/MappingState';
import { allowChains } from '../lib/web3-react';
import { EthNetworkState } from '../store/lib/EthNetworkState';
import { BSCMainnetConfig } from './BSCMainnetConfig';
import { FTMMainnetConfig } from './FTMMainnetConfig';

const EthChains = [BSCMainnetConfig, FTMMainnetConfig];

export const EthNetworkConfig = new EthNetworkState({
  allowChains,
  info: {
    token: {
      tokenExample: '0x000000000000000000000000000000000000000'
    }
  },
  chain: new MappingState({
    currentId: BSCMainnetConfig.chainId,
    map: EthChains.reduce((p, c) => {
      p[c.chainId] = c;
      return p;
    }, {})
  })
});
