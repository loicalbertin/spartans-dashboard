import React from 'react';
import { Stack, BoxProps, Text, Button, Box, Img, Tag, ButtonGroup, chakra, useColorModeValue } from '@chakra-ui/react';
import { observer, useObserver, useLocalStore } from 'mobx-react-lite';
import { useStore } from '@/store/index';
import { helper } from '@/lib/helper';
import Jazzicon from '../Jazzicon';

export const DesktopNav = observer((props: BoxProps) => {
  const { god, lang } = useStore();

  const store = useLocalStore(() => ({
    showConnecter() {
      god.setShowConnecter(true);
    },

    showWalletInfo() {
      god.currentNetwork.walletInfo.visible = true;
    }
  }));

  const accountView = useObserver(() => {
    if (!god.currentNetwork.account) {
      return (
        <Button colorScheme="pink" onClick={store.showConnecter}>
          {lang.t('connect.wallet')}
        </Button>
      );
    }
    return (
      <Button pr="0" pl="4" bg={useColorModeValue('gray.100', 'dark.100')}>
        <Text mr="2" fontSize="sm">
          <chakra.span mr={1}>{god.currentChain.Coin.balance.format}</chakra.span>
          <chakra.span>{god.currentChain.Coin.symbol}</chakra.span>
        </Text>
        <Button
          px={4}
          onClick={store.showWalletInfo}
          sx={{
            color: 'white',
            bgGradient: god.currentChain.info.theme?.bgGradient,
            _hover: { bgGradient: god.currentChain.info.theme?.bgGradient },
            _active: { bgGradient: god.currentChain.info.theme?.bgGradient }
          }}
        >
          <Text mr={2}>{helper.string.truncate(god.currentNetwork.account, 12, '...')}</Text>
          <Jazzicon diameter={22} address={god.currentNetwork.account} style={{ border: '2px solid #617aff', borderRadius: '50px', padding: '1px' }}></Jazzicon>
        </Button>
      </Button>
    );
  });
  return (
    <Stack direction={'row'} spacing={2} {...props}>
      <Button onClick={store.showConnecter} pl={1} borderRadius="40">
        <Img w={8} src={god.currentChain.logoUrl} />
        <Box ml={2}>{god.currentChain.name}</Box>
      </Button>
      {accountView}
    </Stack>
  );
});
