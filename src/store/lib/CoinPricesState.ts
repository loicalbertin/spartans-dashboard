import { computed, makeAutoObservable } from "mobx";
import { CurrenciesStore } from "../currencies";
import { StringState } from "../standard/base";
import { BigNumberState } from "../standard/BigNumberState";

export class CoinPricesState {
  currenciesStore: CurrenciesStore
  tokenAddress= new StringState;
  priceUSD = new BigNumberState({decimals:0});

  @computed
  get priceCurrency() : BigNumberState {
    if (this.priceUSD.loading) {
      return new BigNumberState({});
    }
    return new BigNumberState({
      value: this.priceUSD.value.dividedBy(this.currenciesStore.currencyUSDValue),
      decimals:0,
      loading: false,
    });
  }

  constructor(args: Partial<CoinPricesState>) {
    Object.assign(this, args);

    makeAutoObservable(this);
  }
}
