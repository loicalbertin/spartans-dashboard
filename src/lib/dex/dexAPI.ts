import axios, { AxiosInstance } from 'axios';
import { publicConfig } from 'config/public';
import { Asset } from './types';

const knightApi = axios.create({
  baseURL: '/knight-api',
  headers: {
    'Content-type': 'application/json',
    Accept: 'application/json'
  }
});

const darkKnightApi = axios.create({
  baseURL: '/dark-knight-api',
  headers: {
    'Content-type': 'application/json',
    Accept: 'application/json'
  }
});

knightApi.interceptors.response.use(
  (res) => {
    return res;
  },
  (err) => {
    return Promise.reject(err);
  }
);

darkKnightApi.interceptors.response.use(
  (res) => {
    return res;
  },
  (err) => {
    return Promise.reject(err);
  }
);

export class DexAPI {
  private instance: AxiosInstance;
  constructor(instance: AxiosInstance) {
    this.instance = instance;
  }


  public async getAssets(): Promise<Map<string, Asset>> {
    return this.instance
      .get('/assets').then(response => {
        console.log('>>>data: ', response.data);
        const assets = new Map<string, Asset>();
        Object.entries(response.data).forEach(([assetKey,assetValue]) => assets.set(assetKey.toLowerCase(), assetValue as Asset))
        return assets;
      }).catch(err => Promise.reject(err));
  }

  public async getAsset(id: string): Promise<Asset>{
    return (await this.instance.get('/assets/'+id)).data.data;
  }
}

export const knightDexApi = new DexAPI(knightApi);
export const darkKnightDexApi = new DexAPI(darkKnightApi);
