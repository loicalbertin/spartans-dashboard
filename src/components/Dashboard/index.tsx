
import { Container, Icon, Input, Link, Tab, TabList, TabPanel, TabPanels, Tabs, Text, VStack } from '@chakra-ui/react';
import { reaction } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { AiOutlinePicture, AiOutlineTrophy } from "react-icons/ai";
import { BsYoutube } from "react-icons/bs";
import { useStore } from '../../store/index';
import { NFTsBoard } from '../NFTs';
import { RewardsBoard } from '../RewardsBoard';


export const Dashboard = observer(() => {
  const { god } = useStore();

  useEffect(() => {
    reaction(
      () => god.currentNetwork.account,
      account => {
        if (god.currentNetwork.account) {
          god.trackedWalletAddress.setValue(account);
        }
      });
  }, []);

  return (
    <Container maxW="10xl" p={10}>
      <VStack direction={['column', 'row']} spacing='24px'>
        <Text fontSize="md" fontWeight="bold" justifyContent={'center'} align={'center'} color={'teal.500'}>
          <Link
            href='https://youtu.be/KeRLRkDSkjQ'
            color='teal.500'
            isExternal>Check out Joey's tutorial about this dashboard {' '}<Icon as={BsYoutube} boxSize={5} />
          </Link>
        </Text>
        <Input size='lg'
          placeholder='Wallet address'
          isInvalid={god.currentNetwork.isAddress(god.trackedWalletAddress.value) === false}
          value={god.trackedWalletAddress.value}
          onChange={(e) => {
            god.trackedWalletAddress.setValue(e.target.value);
          }} />

        <Tabs width={'100%'} align={'center'} >
          <TabList>
            <Tab><Icon as={AiOutlineTrophy} boxSize={8} pe={2} /> Rewards</Tab>
            <Tab><Icon as={AiOutlinePicture} boxSize={8} pe={2} /> NFTs</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <RewardsBoard />
            </TabPanel>
            <TabPanel>
              <NFTsBoard />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack >
    </Container >
  );
});
