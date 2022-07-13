import erc721Abi from '../constants/abi/erc721.json';

export class NFTConfig {
  name: string;
  networkKey: string;
  address: string;
  abi: any;
  logo: string;
  explorerURL: string;

  constructor(parameters) {
    Object.assign(this, parameters);
  }
}

export const SpartanNFTsConfig: Array<NFTConfig> = [
  new NFTConfig({
    name: 'S300',
    networkKey: 'bsc',
    address: '0x3da11d42d364c2831ec56fbc3aacea6b37469f7a',
    abi: erc721Abi,
    explorerURL: 'https://bscscan.com',
    logo: '/images/nfts/SpartanNFT_S300.gif'
  }),
  new NFTConfig({
    name: 'S300V2',
    networkKey: 'bsc',
    address: '0x4DaECcEef92F22f7EA69af2f4B50973e0267e3E2',
    abi: erc721Abi,
    explorerURL: 'https://bscscan.com',
    logo: '/images/nfts/SpartanNFT_S300V2.gif'
  }),
  new NFTConfig({
    name: 'S300V3',
    networkKey: 'bsc',
    address: '0x4DaECcEef92F22f7EA69af2f4B50973e0267e3E2',
    abi: erc721Abi,
    explorerURL: 'https://bscscan.com',
    logo: '/images/nfts/SpartanNFT_S300V3.jpg'
  }),
  new NFTConfig({
    name: 'Dark300',
    networkKey: 'ftm',
    address: '0xd307Ee784b004D59592c8f036C0fb0CC7Fd37378',
    abi: erc721Abi,
    explorerURL: 'https://ftmscan.com',
    logo: '/images/nfts/SpartanNFT_Dark300.jpg'
  })
];
