import { darkKnightDexApi, DexAPI, knightDexApi } from '@/lib/dex/dexAPI';
import BigNumber from 'bignumber.js';
import { makeAutoObservable } from 'mobx';
import { CoinPricesState } from './lib/CoinPricesState';
import { BooleanState, StringState } from './standard/base';

class CurrencyFetcher {
  address: string;
  api: DexAPI;
  constructor(address: string, api: DexAPI) {
    this.address = address;
    this.api = api;
  }
}
class CurrencyConfig {
  name: string;
  symbol: string;
  currency: string;
  image: string;
  numeralFormat: string;
  fetcher: CurrencyFetcher;
}

export class CurrenciesStore {
  currency: StringState = new StringState({ value: 'usd' });
  loading: BooleanState = new BooleanState({ value: true });

  spartanCoinPrices = new CoinPricesState({
    currenciesStore: this,
    tokenAddress: new StringState({ value: '0xbcfe392E778dbB59DcAd624F10f7fa8C4a910B1e' })
  });
  knightCoinPrices = new CoinPricesState({
    currenciesStore: this,
    tokenAddress: new StringState({ value: '0xd23811058eb6e7967d9a00dc3886e75610c4abba' })
  });
  darkSpartanCoinPrices = new CoinPricesState({
    currenciesStore: this,
    tokenAddress: new StringState({ value: '0x63aad0448f58ae1b98d75456cfc6f39235e353f6' })
  });
  darkKnightCoinPrices = new CoinPricesState({
    currenciesStore: this,
    tokenAddress: new StringState({ value: '0x6cc0e0aedbbd3c35283e38668d959f6eb3034856' })
  });

  currencyUSDValue: BigNumber = new BigNumber(1);

  constructor() {
    makeAutoObservable(this);
  }

  currencyConfigs = new Map<string, CurrencyConfig>([
    ['usd', { name: 'USD', currency: 'usd', symbol: '$', numeralFormat: '0,0[.]00', image: 'usd.svg', fetcher: null }],
    ['btc', { name: 'BTC', currency: 'btc', symbol: '₿', numeralFormat: '0,0[.]0000', image: 'btc.png', fetcher: new CurrencyFetcher('0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c', knightDexApi) }],
    ['eth', { name: 'ETH', currency: 'eth', symbol: 'Ξ', numeralFormat: '0,0[.]0000', image: 'eth.png', fetcher: new CurrencyFetcher('0x2170Ed0880ac9A755fd29B2688956BD959F933F8', knightDexApi) }],
    ['bnb', { name: 'BNB', currency: 'bnb', symbol: '$BNB ', numeralFormat: '0,0[.]0000', image: 'bnb.png', fetcher: new CurrencyFetcher('0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', knightDexApi) }],
    ['ftm', { name: 'FTM', currency: 'ftm', symbol: '$FTM ', numeralFormat: '0,0[.]00', image: 'ftm.png', fetcher: new CurrencyFetcher('0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83', darkKnightDexApi) }],
    ['guard', { name: 'GUARD', currency: 'guard', symbol: '$Guard ', numeralFormat: '0,0[.]00', image: 'guard.png', fetcher: new CurrencyFetcher('0xF606bd19b1E61574ED625d9ea96C841D4E247A32', knightDexApi) }],
    ['wolfies', { name: 'WOLFIES', currency: 'wolfies', symbol: '$Wolfies ', numeralFormat: '0,0[.]00', image: 'wolfies.png', fetcher: new CurrencyFetcher('0x6Ad2B6d5d8F96c8E581D3100C12878b2151A0423', knightDexApi)}]
  ]);

  async init() {
    console.log('CurrenciesStore init');
    setInterval(() => {
      this.updateCoinsPrices();
      this.updateCurrency();
    }, 10 * 60 * 1000);

    console.log('first update of prices');
    this.updateCoinsPrices();
    this.updateCurrency();
  }

  async updateCurrency() {
    if (this.currency.value === 'usd') {
      this.currencyUSDValue = new BigNumber(1);
      this.loading.setValue(false);
      console.log('set loading to false');
      return;
    }

    const currencyConfig = this.currencyConfigs.get(this.currency.value);
    this.loading.setValue(true);
    currencyConfig.fetcher.api
      .getAsset(currencyConfig.fetcher.address)
      .then((res) => {
        this.currencyUSDValue = new BigNumber(res.price_usd);
        this.loading.setValue(false);
        console.log('set loading to false');
      })
      .catch((reason) => {
        console.log('error retrieving currency', reason);
      });
  }

  async updateCoinsPrices() {
    knightDexApi
      .getAsset(this.knightCoinPrices.tokenAddress.value)
      .then((res) => {
        this.knightCoinPrices.priceUSD.setValue(new BigNumber(res.price_usd));
      })
      .catch((reason) => {
        console.log('error retrieving knight price', reason);
      });
    knightDexApi
      .getAsset(this.spartanCoinPrices.tokenAddress.value)
      .then((res) => {
        this.spartanCoinPrices.priceUSD.setValue(new BigNumber(res.price_usd));
      })
      .catch((reason) => {
        console.log('error retrieving spartan price', reason);
      });
    darkKnightDexApi
      .getAsset(this.darkKnightCoinPrices.tokenAddress.value)
      .then((res) => {
        this.darkKnightCoinPrices.priceUSD.setValue(new BigNumber(res.price_usd));
      })
      .catch((reason) => {
        console.log('error retrieving dark knight price', reason);
      });
    darkKnightDexApi
      .getAsset(this.darkSpartanCoinPrices.tokenAddress.value)
      .then((res) => {
        this.darkSpartanCoinPrices.priceUSD.setValue(new BigNumber(res.price_usd));
      })
      .catch((reason) => {
        console.log('error retrieving dark spartan price', reason);
      });
  }
}
