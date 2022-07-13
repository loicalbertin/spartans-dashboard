import { injected } from '@/lib/web3-react';
import { EthNetworkState } from '@/store/lib/EthNetworkState';
import { MappingState } from '@/store/standard/MappingState';
import { JsonRpcProvider, Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { BSCMainnetConfig } from 'config/BSCMainnetConfig';
import { FTMMainnetConfig } from 'config/FTMMainnetConfig';
import { Provider as MulticallProvider } from 'ethcall';
import { observer, useLocalObservable } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import { eventBus } from '../../lib/event';
import { useStore } from '../../store/index';

export const ETHProvider = observer(({ children }) => {
  const { god, lang } = useStore();
  const { chainId, account, activate, active, library, deactivate, error, connector } = useWeb3React<Web3Provider>();
  const store = useLocalObservable(() => ({
    get defaultChain() {
      return BSCMainnetConfig;
    },
    logout() {
      deactivate();
      god.eth.connector.latestProvider.clear();
    },
    wrongNetwork() {
      toast.error(lang.t('wrong.network'), { id: 'wrong.network' });
    }
  }));

  useEffect(() => {
    // console.log({ chainId });
    if (chainId) {
      if (god.currentNetwork.allowChains.includes(chainId)) {
        god.setChain(chainId);
      }
    } else {
      god.currentNetwork.chain.setCurrentId(BSCMainnetConfig.chainId);
      // store.wrongNetwork();
    }

    god.currentNetwork.setAccount(account);
    //@ts-ignore
    god.eth.provider = library ? library : god.eth.defaultEthers;
    god.eth.signer = library ? library.getSigner() : null;

    god.eth.multiCall = new MulticallProvider();
    god.eth.multiCall.provider = god.eth.provider;
    god.eth.multiCall.multicall = { address: god.currentChain.info.multicallAddr, block: 0 };
    god.eth.multiCall.multicall2 = { address: god.currentChain.info.multicall2Addr, block: 0 };

    if (account) {
      god.setShowConnecter(false);
      god.currentNetwork.loadBalance();
    }
    god.updateTicker.setValue(god.updateTicker.value + 1);
  }, [god, library, chainId, account, active, error]);

  useEffect(() => {
    if (activate && god.eth.connector.latestProvider.value) {
      if (god.eth.connector.latestProvider.value == 'inject') {
        activate(injected);
      }
    }
  }, [activate, god.eth.connector.latestProvider.value]);

  useEffect(() => {
    eventBus.addListener('wallet.logout', store.logout);
    return () => {
      eventBus.removeListener('wallet.logout', store.logout);
    };
  }, []);


  useEffect(()=> {
    const provider = new JsonRpcProvider(FTMMainnetConfig.rpcUrl);
    const mcp = new MulticallProvider();
    mcp.provider= provider;
    mcp.multicall = { address: FTMMainnetConfig.info.multicallAddr, block: 0 };
    mcp.multicall2 = { address: FTMMainnetConfig.info.multicall2Addr, block: 0 };
    god.ftmNetwork = new EthNetworkState({
      god: god,
      allowChains: [FTMMainnetConfig.chainId],
      chain: new MappingState({
        currentId: FTMMainnetConfig.chainId,
        map: { 250: FTMMainnetConfig }
      }),
      provider: provider,
      signer: library ? library.getSigner() : null,
      multiCall: mcp
    });
  }, []);

  useEffect(()=> {
    const provider = new JsonRpcProvider(BSCMainnetConfig.rpcUrl);
    const mcp = new MulticallProvider();
    mcp.provider= provider;
    mcp.multicall = { address: BSCMainnetConfig.info.multicallAddr, block: 0 };
    mcp.multicall2 = { address: BSCMainnetConfig.info.multicall2Addr, block: 0 };
    god.bscNetwork = new EthNetworkState({
      god: god,
      allowChains: [BSCMainnetConfig.chainId],
      chain: new MappingState({
        currentId: BSCMainnetConfig.chainId,
        map: { [BSCMainnetConfig.chainId]: BSCMainnetConfig }
      }),
      provider: provider,
      signer: library ? library.getSigner() : null,
      multiCall: mcp
    });
  }, []);

  return <></>;
});
