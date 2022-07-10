import { ChakraProvider } from '@chakra-ui/react';
import { Web3ReactProvider } from '@web3-react/core';
import type { AppProps } from 'next/app';
import { useEffect, useMemo } from 'react';
import { Toaster } from 'react-hot-toast';

import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header/index';
import { theme } from '@/lib/theme';
import { useStore } from '@/store/index';
import { ETHProvider } from '../components/EthProvider';
import { WalletSelecter } from '../components/WalletSelecter/index';
import { getLibrary } from '../lib/web3-react';

function MyApp({ Component, pageProps }: AppProps) {
  const { lang, god, currencies } = useStore();
  useEffect(() => {
    lang.init();
    currencies.init();
    setInterval(() => {
      god.pollingData();
    }, 15000);
  }, []);
  // use useMemo to fix issue https://github.com/vercel/next.js/issues/12010
  return useMemo(() => {
    return (
      <ChakraProvider theme={theme}>
        <Web3ReactProvider getLibrary={getLibrary}>
          <WalletSelecter />
          <ETHProvider />
          <Toaster />
          <Header />
          <Component {...pageProps} />
          <Footer />
        </Web3ReactProvider>
      </ChakraProvider>
    )
  }, [Component, pageProps]);
}

export default MyApp;
