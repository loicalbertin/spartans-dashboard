import { DesktopNav } from '@/components/Header/DesktopNav';
import { helper } from '@/lib/helper';
import { HamburgerIcon } from '@chakra-ui/icons';
import {
  Alert, AlertDescription, AlertIcon, Box, CloseButton, Container,
  Drawer, DrawerBody, DrawerCloseButton, DrawerContent, Flex, Heading, HStack, Icon, IconButton,
  Link as LinkC, Stack, useColorMode, useColorModeValue, useDisclosure
} from '@chakra-ui/react';
import { useWeb3React } from '@web3-react/core';
import { NoEthereumProviderError } from '@web3-react/injected-connector';
import { observer } from 'mobx-react-lite';
import Link from 'next/link';
import React from 'react';
import { IoMoon, IoSunny } from 'react-icons/io5';
import { getErrorMessage } from '../../lib/web3-react';
import { CurrenciesPopover } from '../CurrenciesPopover';
import { DarkLogo, Logo } from '../Logo';
import { WalletInfo } from '../WalletInfo';

export const Header = observer(() => {
  const { isOpen: isMobileNavOpen, onToggle, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const { error } = useWeb3React();

  return (
    <Box>
      <Flex
        as={'header'}
        minH={'60px'}
        boxShadow={'sm'}
        zIndex="999"
        justify={'center'}
        css={{
          backdropFilter: 'saturate(180%) blur(5px)',
          backgroundColor: useColorModeValue('rgba(255, 255, 255, 0.8)', 'rgba(26, 32, 44, 0.8)')
        }}
      >
        <Container as={Flex} maxW={'7xl'} align={'center'}>
          <Flex flex={{ base: 1, md: 'auto' }} display={{ base: 'flex', md: 'none' }}>
            <IconButton onClick={onToggle} icon={<HamburgerIcon w={5} h={5} />} variant={'ghost'} size={'sm'} aria-label={'Toggle Navigation'} />
            <Drawer size={'xs'} isOpen={isMobileNavOpen} onClose={onClose} placement='top'>
              <DrawerContent>
                <DrawerCloseButton />
                <DrawerBody id='mobileDrawerBody'>
                  <HStack>
                    <DesktopNav />
                    <IconButton borderRadius="12" aria-label={'Toggle Color Mode'} onClick={toggleColorMode} icon={colorMode == 'light' ? <IoMoon size={18} /> : <IoSunny size={18} />} />
                    <CurrenciesPopover />
                  </HStack>
                </DrawerBody>
              </DrawerContent>
            </Drawer>
          </Flex>

          <Flex justify={{ base: 'center', md: 'start' }}>
            <Link href="/">
              <Stack as={'a'} direction={'row'} alignItems={'center'} spacing={{ base: 2, sm: 4 }}>
                <Icon as={Logo} w={{ base: 16, sm: 28 }} h={{ base: 16, sm: 28 }} />
                <Heading as={'h1'} fontSize={{ base: 'large', md: 'x-large', lg: 'xx-large' }} display={{ base: 'block', sm: 'block' }}>
                  Spartans / Dark Spartans Dashboard
                </Heading>
                <Icon as={DarkLogo} transform={'scaleX(-1)'} w={{ base: 16, sm: 28 }} h={{ base: 16, sm: 28 }} />
              </Stack>
            </Link>
          </Flex>

          <Stack display={{ base: 'none', sm: 'flex' }} direction={'row'} align={'center'} spacing={2} flex={{ base: 1, md: 'auto' }} justify={'flex-end'}>
            <Flex display={{ base: 'flex', md: 'flex' }} ml={10}>
              <DesktopNav />
            </Flex>
            <CurrenciesPopover addPortal />
            <IconButton borderRadius="12" aria-label={'Toggle Color Mode'} onClick={toggleColorMode} icon={colorMode == 'light' ? <IoMoon size={18} /> : <IoSunny size={18} />} />
          </Stack>
        </Container>
      </Flex>
      <Container maxW={'7xl'} size="">
        {error && (
          <Alert status="error" alignContent={'center'}>
            <AlertIcon />
            {error instanceof NoEthereumProviderError ?
              <AlertDescription >
                <LinkC href={helper.env.isPc() ? 'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn' : 'https://iopay.me'}>{getErrorMessage(error)}</LinkC>
              </AlertDescription> : <AlertDescription>
                {getErrorMessage(error)}
              </AlertDescription>}
            <CloseButton position="absolute" right="8px" top="8px" />
          </Alert>
        )}
      </Container>
      <WalletInfo />
    </Box>
  );
});
