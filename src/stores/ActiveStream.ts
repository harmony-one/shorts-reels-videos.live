import { action, autorun, computed, makeAutoObservable, observable } from 'mobx';
import { IStores } from 'stores';
import { getLiveStream, likeLiveStream, getLiveStreamToken, startLiveStream } from 'utils';
import { Space, SpaceEvent, getUserMedia } from "@mux/spaces-web";

export enum FETCH_STATUS {
  INIT = 'INIT',
  FIRST_LOADING = 'FIRST_LOADING',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export class ActiveStream {
  public stores: IStores;

  @observable space: Space;
  @observable localParticipant;
  @observable startStreamLoading = false;

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

  ///////////////////////////

  @action.bound
  initSpace = async () => {
    const res = await getLiveStreamToken(this.data.id);
    this.space = new Space(res.data);
  }

  @action.bound
  startStream = async () => {
    try {
      this.startStreamLoading = true;

      await this.initSpace();

      this.localParticipant = await this.space.join();

      // Get and publish our local tracks
      let localTracks = await getUserMedia({
        audio: true,
        video: true,
      });

      await this.localParticipant.publishTracks(localTracks);

      // while (!starting) {
      try {
        await startLiveStream(this.data.id);
        // starting = true;
      } catch (e) {
        //sleep(2000); 
      }
    } catch (e) { }

    this.startStreamLoading = false;
  }

  @action.bound
  stopStream = async () => {
    // // Set the local participant so it will be rendered
    await this.space.leave();

    this.localParticipant.unpublishAllTracks({ stop: true });

    this.localParticipant = null;

    // await stopBroadcast({
    //     spaceId: props.ownerCreds.spaceId,
    //     broadcastId: props.ownerCreds.broadcastId,
    // });
  };
}