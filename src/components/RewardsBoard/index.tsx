
import spartanAbi from '@/constants/abi/spartan.json';
import TokenState from '@/store/lib/TokenState';
import { BooleanState, StringState } from '@/store/standard/base';
import { BigNumberState } from '@/store/standard/BigNumberState';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Box, Container, Divider, Grid, GridItem, HStack, Icon, Image, Input, Link, SimpleGrid, Stack, StackDivider, Text, VStack } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import { action, reaction } from 'mobx';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useStore } from '../../store/index';


export const RewardsBoard = observer(() => {
  const { god } = useStore();

  const store = useLocalObservable(() => ({
    walletAddress: new StringState(),
    spartanToken: new TokenState({ address: "0xbcfe392E778dbB59DcAd624F10f7fa8C4a910B1e", abi: spartanAbi, fixed: 6 }),
    knightToken: new TokenState({ address: "0xd23811058eb6e7967d9a00dc3886e75610c4abba", abi: spartanAbi, fixed: 6 }),
    totalDividendsDistributed: new BigNumberState({ fixed: 6 }),
    accountTotalDividendsDistributed: new BigNumberState({ fixed: 6 }),
    accountWithdrawableDividends: new BigNumberState({ fixed: 6 }),
    isQualifiedForRewards: new BooleanState(),
    async updateCommonData() {
      await god.currentNetwork.multicall(
        [
          store.spartanToken.preMulticall({ method: 'decimals', handler: action('setDecimals', (v: any) => (store.spartanToken.decimals = Number(v.toString()))) }),
          store.knightToken.preMulticall({ method: 'decimals', handler: action('setDecimals', (v: any) => (store.knightToken.decimals = Number(v.toString()))) }),
          store.spartanToken.preMulticall({ method: 'getTotalDividendsDistributed', handler: action('setTotalDividendsDistributed', (v: any) => (store.totalDividendsDistributed.setValue(new BigNumber(v.toString())))) })
        ].filter((i) => !!i)
      );
    },
    async updateDataForWallet() {
      const val = store.walletAddress.value;
      if (god.currentNetwork.isAddress(val)) {
        await god.currentNetwork.multicall(
          [
            store.spartanToken.preMulticall({
              method: 'getAccountDividendsInfo', params: [val], handler: action('setAccountDividendsInfo', (v: any) => {
                store.accountTotalDividendsDistributed.setValue(new BigNumber(v.totalDividends.toString()));
                store.accountWithdrawableDividends.setValue(new BigNumber(v.withdrawableDividends.toString()));
              })
            }),
            store.spartanToken.preMulticall({ method: 'balanceOf', params: [val], handler: action('setBalance', (v: any) => (store.spartanToken._balance.setValue(new BigNumber(v.toString())))) }),
            store.knightToken.preMulticall({ method: 'balanceOf', params: [val], handler: action('setBalance', (v: any) => (store.knightToken._balance.setValue(new BigNumber(v.toString())))) })
          ].filter((i) => !!i)
        );
      }
    }
  }));

  useEffect(() => {
    reaction(
      () => god.currentNetwork.account,
      account => {
        if (god.currentNetwork.account) {
          store.walletAddress.setValue(account);
        }
      });

    reaction(
      () => store.walletAddress.value,
      async (val) => {
        store.updateCommonData();
        store.updateDataForWallet();
      });

    reaction(
      () => store.spartanToken._balance.value,
      val => {
        action('setQualifiedForRewards', () => (store.isQualifiedForRewards.setValue(val.gte(new BigNumber(50000 * (10 ** 18))))))();
      });

    setInterval(() => {
      store.updateCommonData();
      store.updateDataForWallet();
    }, 10 * 60 * 1000);

  }, []);



  return (
    <Container maxW="10xl" p={10}>
      <VStack direction={['column', 'row']} spacing='24px'>
        <Input size='lg'
          placeholder='Wallet address'
          isInvalid={god.currentNetwork.isAddress(store.walletAddress.value) === false}
          value={store.walletAddress.value}
          onChange={(e) => {
            store.walletAddress.setValue(e.target.value);
          }} />

        <Divider />
        <SimpleGrid w='100%' minChildWidth='180px' spacing={12}>


          <VStack spacing='4px'>
            <Text fontSize='xx-large' >In your wallet</Text>
            <Box w='100%' p={4} borderWidth='1px' borderRadius='lg'>
              <HStack spacing='4px' placeContent={'flex-end'}>
                <Text fontSize='x-large' fontWeight='bold'>{store.spartanToken.balance.format}</Text>
                <Image src='images/spartans.png' boxSize="32px" />
              </HStack>
              <HStack placeContent={'flex-end'}>
                <Text fontSize='x-large' fontWeight='bold' >{store.knightToken.balance.format}</Text>
                <Image src='images/knight-icon.png' boxSize="32px" />
              </HStack>
            </Box>
            <Text align={'center'}
              hidden={store.isQualifiedForRewards.value}>
              You need to hold at least 50,000 Spartan tokens in your wallet to qualify for receiving rewards.
              Buy more tokens on{' '}
              <Link
                href='https://dex.knightswap.financial/#/add/ETH/0xbcfe392e778dbb59dcad624f10f7fa8c4a910b1e'
                color='teal.500'
                isExternal>KnightSwap <ExternalLinkIcon mx='2px' /></Link>.
            </Text>
          </VStack>

          <Grid >
            <GridItem w='100%'>
              <Text align={'center'} fontSize='xx-large'>Your Rewards</Text>
            </GridItem>
            <GridItem w='100%'>
              <Text align='center' fontSize='x-large'>Total earned</Text>
              <HStack placeContent={'flex-end'}>
                <Text fontSize='x-large' fontWeight='bold'>{store.accountTotalDividendsDistributed.format}</Text>
                <Image src='images/knight-icon.png' boxSize="32px" />
              </HStack>
            </GridItem>
            <GridItem w='100%'>
              <Text align='center' fontSize='x-large'>Accumulating Rewards (pending)</Text>
              <HStack placeContent={'flex-end'}>
                <Text fontSize='x-large' fontWeight='bold'>{store.accountWithdrawableDividends.format}</Text>
                <Image src='images/knight-icon.png' boxSize="32px" />
              </HStack>
            </GridItem>
          </Grid>


        </SimpleGrid>
        <Divider />
        <Box>
          <Text fontSize='xx-large'>Total Rewards Distributed to Holders</Text>
          <HStack placeContent={'center'}>
            <Text align={'center'} fontSize='x-large' fontWeight='bold'>{store.totalDividendsDistributed.format}</Text>
            <Image src='images/knight-icon.png' boxSize="32px" />
          </HStack>
        </Box>

        <Divider />

        <Text align={'justify'}>
          Reflections depends on trade volume to gas fee. Rewards are going to be accumulating in the background.
        </Text>
        <Text align={'justify'}>
          However it needs to hit a certain threshold to justify gas fees to airdrop rewards. Larger holders will hit that threshold sooner but that doesn't impact lower holders rewards as they still accumulate.
        </Text>

        <Text  align={'justify'}>
          All you need to know about Spartan token, reflections and how to compound your investment can be found in the{' '}
          <Link
                href='https://info-121.gitbook.io/welcome-to-the-spartan-army/'
                color='teal.500'
                isExternal>Spartan whitepaper<ExternalLinkIcon mx='2px' /></Link>.
        </Text>
      </VStack >
    </Container >
  );
});
