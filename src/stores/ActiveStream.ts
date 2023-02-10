import { action, autorun, computed, makeAutoObservable, observable } from 'mobx';
import { IStores } from 'stores';
import { getLiveStream, likeLiveStream } from 'utils';

export enum FETCH_STATUS {
  INIT = 'INIT',
  FIRST_LOADING = 'FIRST_LOADING',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export class ActiveStream {
  public stores: IStores;

  @observable fetchStatus = FETCH_STATUS.INIT;
  @observable error = '';

  @observable chatVisible = true;

  @observable data;

  constructor(stores) {
    this.stores = stores;

    makeAutoObservable(this);

    setInterval(() => this.data && this.loadStream(this.data.id), 3000)
  }

  @computed
  get isInitilized() {
    return this.fetchStatus === FETCH_STATUS.SUCCESS
      || this.fetchStatus === FETCH_STATUS.LOADING;
  }

  @action.bound
  loadStream = async (id) => {
    this.fetchStatus = this.fetchStatus === FETCH_STATUS.INIT ?
      FETCH_STATUS.FIRST_LOADING : FETCH_STATUS.LOADING;

    try {
      const res = await getLiveStream(id, this.stores.user.address);

      this.data = res.data;

      this.fetchStatus = FETCH_STATUS.SUCCESS;
    } catch (e) {
      this.error = e?.message;

      this.fetchStatus = FETCH_STATUS.ERROR;
    }
  }

  @action.bound
  likeLiveStream = async () => {
    if (this.stores.user.address) {
      await likeLiveStream(this.data?.id, this.stores.user.address);
      await this.loadStream(this.data.id);
    }
  }

  @action.bound
  toggleChatVisible = () => {
    this.chatVisible = !this.chatVisible;
  }

  @action.bound
  clean = () => {
    this.data = null;
    this.fetchStatus = FETCH_STATUS.INIT;
    this.error = '';
  }
}