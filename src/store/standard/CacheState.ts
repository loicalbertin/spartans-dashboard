import { makeAutoObservable, toJS } from 'mobx';
import { eventBus } from '../../lib/event';
import { cacheStorage } from '../../lib/localforage';

export class CacheState<T = Record<string, string>> {
  id: string;
  data: T = {} as T;
  cacher = cacheStorage;
  onData: (value: any) => void;
  target: any;

  constructor(args: Partial<CacheState<T>>) {
    Object.assign(this, args);
    makeAutoObservable(this);
    this.get();
    eventBus.on('global.cacheData', () => {
      this.save();
    });
  }
  setValue(key, val) {
    this.data[key] = val;
  }
  save() {
    // console.log(this.data);
    this.cacher.setItem(this.id, toJS(this.data));
  }
  async get(): Promise<T> {
    const data = await this.cacher.getItem<T>(this.id);
    if (data) {
      this.data = data;
    }
    return data;
  }
}
