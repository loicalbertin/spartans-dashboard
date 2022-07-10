import { ArrayState, NumberState } from "@/store/standard/base";
import { BigNumberState } from "@/store/standard/BigNumberState";
import { Container, SimpleGrid } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/react";
import BigNumber from 'bignumber.js';
import { SpartanNFTsConfig } from "config/SpartanNFTsConfig";
import { action, reaction } from "mobx";
import { observer, useLocalObservable } from "mobx-react-lite";
import { useEffect } from "react";
import { useStore } from '../../store/index';
import { ReadFunction } from "../../store/lib/ContractState";
import { NFTState } from "../../store/lib/NFTState";
import { NFTThumbnail } from "./thumbnail";



export const NFTsBoard = observer(() => {
  const { god } = useStore();
  const store = useLocalObservable(() => ({

    nfts: new ArrayState<NFTState>({ value: new Array<NFTState>() }),
    loadingConfigs: new NumberState({ value: 0 }),
    loadingTokens: new NumberState({ value: 0 }),

    loadNFTs(walletAddress: string) {
      store.nfts.setValue(new Array<NFTState>());
      store.loadingConfigs.setValue(SpartanNFTsConfig.length);
      store.loadingTokens.setValue(0);
      // console.log('loadNFTs for wallet: %s', walletAddress);
      for (const nftConfig of SpartanNFTsConfig) {
        // console.log('loadNFTs for config: %s', nftConfig.name);
        let nftsBalanceFn = new ReadFunction<[string], any>({ name: 'balanceOf', contract: nftConfig, value: new BigNumberState({}) });
        let nftsTokenByIndexFn = new ReadFunction<[string, number], any>({ name: 'tokenOfOwnerByIndex', contract: nftConfig, value: new BigNumberState({}) });
        let netState = god.bscNetwork;
        if (nftConfig.networkKey == 'ftm') {
          netState = god.ftmNetwork;
        }
        netState.multicall(
          [
            nftsBalanceFn.preMulticall({
              params: [walletAddress], handler: action('readTokens', (v: any) => {
                let balance = new BigNumber(v.toString());
                // console.log('loadNFTs balanceOf result: %d', balance);
                store.loadingTokens.setValue(store.loadingTokens.value + balance.toNumber());
                store.loadingConfigs.setValue(store.loadingConfigs.value - 1);
                for (let index = 0; new BigNumber(index).isLessThan(balance); index++) {
                  // console.log('loadNFTs loading index: %d', index);
                  netState.multicall(
                    [
                      nftsTokenByIndexFn.preMulticall({
                        params: [walletAddress, index], handler: action('addNFT', (v: any) => {
                          let tokenId = new BigNumber(v.toString());
                          // console.log('loadNFTs tokenOfOwnerByIndex index: %d result: %d', index, tokenId);
                          store.nfts.value.push(new NFTState({ tokenId: tokenId, config: nftConfig }));
                          store.loadingTokens.setValue(store.loadingTokens.value - 1);
                        })
                      })
                    ].filter((i) => !!i)
                  );
                }
              })
            })
          ].filter((i) => !!i)
        );
      }
    }
  }));

  useEffect(() => {
    // console.log('init NFTs');

    reaction(
      () => god.trackedWalletAddress.value,
      async (val) => {
        if (god.currentNetwork.isAddress(val)) {
          store.loadNFTs(val);
        }
      });
  }, []);


  return (
    <Container maxW="10xl" pb={12}>
      <Spinner size='xl'
        emptyColor='gray.200'
        color='blue.500'
        visibility={store.loadingConfigs.value == 0 && store.loadingTokens.value == 0 ? "hidden" : "visible"} />
      <SimpleGrid columns={{ sm: 2, md: 3 }} spacing={10}>
        {store.nfts.value.map((nft) => (
          <NFTThumbnail state={nft} />
        ))}
      </SimpleGrid>
    </Container >
  );
});
