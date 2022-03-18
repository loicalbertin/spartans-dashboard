import { Web3Provider } from '@ethersproject/providers';
import { UserRejectedRequestError as UserRejectedRequestErrorWalletConnect, WalletConnectConnector } from '@iotexproject/walletconnect-connector';
import { UnsupportedChainIdError } from '@web3-react/core';
import { InjectedConnector, NoEthereumProviderError, UserRejectedRequestError } from '@web3-react/injected-connector';

const POLLING_INTERVAL = 12000;
export const RPC_URLS = {
  56: 'https://bsc-dataseed.binance.org',
  250: 'https://rpc.ftm.tools/'
};

export const allowChains = Object.keys(RPC_URLS).map((i) => Number(i));

export function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider);
  library.pollingInterval = POLLING_INTERVAL;
  return library;
}

export const injected = new InjectedConnector({ supportedChainIds: allowChains });

export const walletconnect = new WalletConnectConnector({
  rpc: { 4689: RPC_URLS[4689] },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  pollingInterval: POLLING_INTERVAL
});

export function getErrorMessage(error: Error) {
  if (error instanceof NoEthereumProviderError) {
    return 'No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.';
  } else if (error instanceof UnsupportedChainIdError) {
    return "You're connected to an unsupported network.";
  } else if (error instanceof UserRejectedRequestError || error instanceof UserRejectedRequestErrorWalletConnect) {
    return 'Please authorize this website to access your Ethereum account.';
  } else {
    console.error(error);
    return 'An unknown error occurred. Check the console for more details.';
  }
}
