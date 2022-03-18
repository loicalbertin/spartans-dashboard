
import spartanAbi from '@/constants/abi/spartan.json';
import TokenState from '@/store/lib/TokenState';
import { BooleanState, StringState } from '@/store/standard/base';
import { BigNumberState } from '@/store/standard/BigNumberState';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Box, Container, Divider, Grid, GridItem, HStack, Icon, Image, Input, Link, SimpleGrid, Text, VStack, Wrap, WrapItem } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import { action, reaction } from 'mobx';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useEffect } from 'react';
import { BiWallet } from "react-icons/bi";
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
    darkSpartanToken: new TokenState({ address: "0x63aad0448f58ae1b98d75456cfc6f39235e353f6", abi: spartanAbi, fixed: 6 }),
    darkKnightToken: new TokenState({ address: "0x6cc0e0aedbbd3c35283e38668d959f6eb3034856", abi: spartanAbi, fixed: 6 }),
    darkTotalDividendsDistributed: new BigNumberState({ fixed: 6 }),
    darkAccountTotalDividendsDistributed: new BigNumberState({ fixed: 6 }),
    darkAccountWithdrawableDividends: new BigNumberState({ fixed: 6 }),
    isQualifiedForRewards: new BooleanState(),
    isQualifiedForDarkRewards: new BooleanState(),
    async updateCommonData() {
      await god.bscNetwork.multicall(
        [
          store.spartanToken.preMulticall({ method: 'getTotalDividendsDistributed', handler: action('setTotalDividendsDistributed', (v: any) => (store.totalDividendsDistributed.setValue(new BigNumber(v.toString())))) })
        ].filter((i) => !!i)
      );
      await god.ftmNetwork.multicall(
        [
          store.darkSpartanToken.preMulticall({ method: 'getTotalDividendsDistributed', handler: action('setTotalDividendsDistributed', (v: any) => (store.darkTotalDividendsDistributed.setValue(new BigNumber(v.toString())))) })
        ].filter((i) => !!i)
      );
    },
    async updateDataForWallet() {
      const val = store.walletAddress.value;
      if (god.bscNetwork.isAddress(val)) {
        await god.bscNetwork.multicall(
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
        await god.ftmNetwork.multicall(
          [
            store.darkSpartanToken.preMulticall({
              method: 'getAccountDividendsInfo', params: [val], handler: action('setAccountDividendsInfo', (v: any) => {
                store.darkAccountTotalDividendsDistributed.setValue(new BigNumber(v.totalDividends.toString()));
                store.darkAccountWithdrawableDividends.setValue(new BigNumber(v.withdrawableDividends.toString()));
              })
            }),
            store.darkSpartanToken.preMulticall({ method: 'balanceOf', params: [val], handler: action('setBalance', (v: any) => (store.darkSpartanToken._balance.setValue(new BigNumber(v.toString())))) }),
            store.darkKnightToken.preMulticall({ method: 'balanceOf', params: [val], handler: action('setBalance', (v: any) => (store.darkKnightToken._balance.setValue(new BigNumber(v.toString())))) })
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
        action('setQualifiedForRewards', () => (store.isQualifiedForRewards.setValue(val.gte(new BigNumber(50000 * (10 ** 18))) || val.lte(new BigNumber(0)) )))();
      });

    reaction(
      () => store.darkSpartanToken._balance.value,
      val => {
        action('setQualifiedForDarkRewards', () => (store.isQualifiedForDarkRewards.setValue(val.gte(new BigNumber(50000 * (10 ** 18)))  || val.lte(new BigNumber(0)) )))();
      });

    setInterval(() => {
      store.updateCommonData();
      store.updateDataForWallet();
    }, 10 * 60 * 1000);

    store.updateCommonData();
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
              <Icon as={BiWallet} boxSize={8} />
              <HStack spacing='4px' placeContent={'flex-end'}>
                <Text fontSize='x-large' fontWeight='bold'>{store.spartanToken.balance.format}</Text>
                <Image src='images/spartans.png' boxSize="32px" />
              </HStack>
              <HStack placeContent={'flex-end'}>
                <Text fontSize='x-large' fontWeight='bold' >{store.knightToken.balance.format}</Text>
                <Image src='images/knight-icon.png' boxSize="32px" />
              </HStack>
              <HStack spacing='4px' placeContent={'flex-end'}>
                <Text fontSize='x-large' fontWeight='bold'>{store.darkSpartanToken.balance.format}</Text>
                <Image src='images/dark-spartans.png' boxSize="32px" />
              </HStack>
              <HStack placeContent={'flex-end'}>
                <Text fontSize='x-large' fontWeight='bold' >{store.darkKnightToken.balance.format}</Text>
                <Image src='images/dKNIGHT.svg' boxSize="32px" />
              </HStack>
            </Box>
            <Text align={'center'}
              hidden={store.isQualifiedForRewards.value}>
              You need to hold at least 50,000 Spartan tokens in your wallet to qualify for receiving rewards.
              Buy more tokens on{' '}
              <Link
                href='https://dex.knightswap.financial/#/swap'
                color='teal.500'
                isExternal>KnightSwap <ExternalLinkIcon mx='2px' /></Link>.
            </Text>
            <Text align={'center'}
              hidden={store.isQualifiedForDarkRewards.value}>
              You need to hold at least 50,000 Dark Spartan tokens in your wallet to qualify for receiving rewards.
              Buy more tokens on{' '}
              <Link
                href='https://darkdex.knightswap.financial/#/swap'
                color='teal.500'
                isExternal>Dark KnightSwap <ExternalLinkIcon mx='2px' /></Link>.
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
              <HStack placeContent={'flex-end'}>
                <Text fontSize='x-large' fontWeight='bold'>{store.darkAccountTotalDividendsDistributed.format}</Text>
                <Image src='images/dKNIGHT.svg' boxSize="32px" />
              </HStack>
            </GridItem>
            <GridItem w='100%'>
              <Text align='center' fontSize='x-large'>Accumulating Rewards (pending)</Text>
              <HStack placeContent={'flex-end'}>
                <Text fontSize='x-large' fontWeight='bold'>{store.accountWithdrawableDividends.format}</Text>
                <Image src='images/knight-icon.png' boxSize="32px" />
              </HStack>
              <HStack placeContent={'flex-end'}>
                <Text fontSize='x-large' fontWeight='bold'>{store.darkAccountWithdrawableDividends.format}</Text>
                <Image src='images/dKNIGHT.svg' boxSize="32px" />
              </HStack>
            </GridItem>
          </Grid>


        </SimpleGrid>
        <Divider />
        <Box>
          <Text fontSize='xx-large'>Total Rewards Distributed to Holders</Text>
          <Wrap align='center' spacing='20px' justify='center'>
            <WrapItem>
              <HStack placeContent={'center'}>
                <Text align={'center'} fontSize='x-large' fontWeight='bold'>{store.totalDividendsDistributed.format}</Text>
                <Image src='images/knight-icon.png' boxSize="32px" />
              </HStack>
            </WrapItem>
            <WrapItem>
              <HStack placeContent={'center'}>
                <Text align={'center'} fontSize='x-large' fontWeight='bold'>{store.darkTotalDividendsDistributed.format}</Text>
                <Image src='images/dKNIGHT.svg' boxSize="32px" />
              </HStack>
            </WrapItem>
          </Wrap>
        </Box>

        <Divider />

        <Text align={'justify'}>
          Reflections depends on trade volume to gas fee. Rewards are going to be accumulating in the background.
        </Text>
        <Text align={'justify'}>
          However it needs to hit a certain threshold to justify gas fees to airdrop rewards. Larger holders will hit that threshold sooner but that does not impact lower holders rewards as they still accumulate.
        </Text>

        <Text align={'justify'}>
          All you need to know about Spartan token, reflections and how to compound your investment can be found in the{' '}
          <Link
            href='https://info-121.gitbook.io/welcome-to-the-spartan-army/'
            color='teal.500'
            isExternal>Spartan whitepaper<ExternalLinkIcon mx='2px' /></Link>{' '} for BSC and <Link
            href='https://info-121.gitbook.io/spartans-army-ftm/'
            color='teal.500'
            isExternal>Dark Spartan whitepaper<ExternalLinkIcon mx='2px' /></Link>{' '} for Fantom.
        </Text>
      </VStack >
    </Container >
  );
});
