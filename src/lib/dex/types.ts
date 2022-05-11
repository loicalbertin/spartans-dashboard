import BigNumber from 'bignumber.js';


export interface Asset {
  price_usd: BigNumber
  price_bnb?: BigNumber
  price_ftm?: BigNumber
  name?: string
  symbol?: string
  id?: string
  maker_fee?: number
  taker_fee?: number
}

export interface AssetResponse {
  updated_at: string
  data: Asset[]
}

export interface AssetsResponse extends Map<string, Asset> {};
