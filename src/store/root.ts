import { GodStore } from './god';
import { LangStore } from './lang';

export default class RootStore {
  lang = new LangStore();
  god = new GodStore(this);
}
