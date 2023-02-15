import { action, autorun, computed, makeAutoObservable, observable } from 'mobx';
import detectEthereumProvider from '@metamask/detect-provider';
import Web3 from 'web3';
import { getChainConfig } from './helpers';
import { IStores } from 'stores';
import { createChatUser, getChatKeys } from 'utils';

const defaults = {};

export class UserStoreMetamask {
  public stores: IStores;

  @observable public isAuthorized: boolean = false;
  @observable public isInitilized: boolean = false;
  @observable error: string = '';

  @observable public isMetaMask = false;
  private provider: any;

  @observable public balance = '0';
  @observable public address: string = '';

  @observable metamaskChainId = 0;

  @observable chatApiKey = '';
  @observable chatUserToken = '';

  constructor(stores) {
    this.stores = stores;

    makeAutoObservable(this)

    setInterval(() => this.updateBalance(), 3 * 1000);

    const session = localStorage.getItem('harmony_metamask_session');

    const sessionObj = JSON.parse(session);

    if (sessionObj && !!sessionObj.address) {
      this.signIn();
    } else {
      this.isInitilized = true;
    }

    autorun(() => {
      if (this.isNetworkActual) {
        // this.signIn();
      }
    });
  }

  @action.bound
  getStreamChatKeys = async () => {
    let res = await getChatKeys(this.address);

    if(typeof res.data.userToken !== 'string') {
      res = await createChatUser(this.address);
    }

    this.chatApiKey = res.data.apiKey;
    this.chatUserToken = res.data.userToken;
  }

  @computed public get isNetworkActual() {
    return true;
    // const config = this.stores.exchange.getChainConfig();

    // return numberToHex(Number(this.metamaskChainId)) === config.chainId;
  }

  @action.bound
  updateBalance = async () => {
    if (this.address) {
      const balanceHex = await this.provider.request({
        method: 'eth_getBalance',
        params: [this.address, 'latest'],
      });

      const balance = Number(balanceHex);
      this.balance = balance.toString();
    }
  }

  @action.bound
  handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      this.signOut();
    } else {
      this.address = accounts[0];

      this.getStreamChatKeys();

      try {
        this.updateBalance();
      } catch (err) {
        console.log('### err', err);
      }

      this.syncLocalStorage();
    }
  }

  @action.bound
  setError = (error: string) => {
    this.error = error;
    this.isAuthorized = false;
  }

  @action.bound
  public signOut = async () => {
    console.log('### metamask signout');

    this.isAuthorized = false;
    this.address = '';

    this.syncLocalStorage();

    // await this.provider.request({
    //   method: 'wallet_requestPermissions',
    //   params: [
    //     {
    //       eth_accounts: {},
    //     },
    //   ],
    // });
  }

  @action.bound
  public signIn = async (isNew = false) => {
    console.log('### metamask signin');

    try {
      this.error = '';

      const provider = await detectEthereumProvider();

      // @ts-ignore
      if (provider !== window.ethereum) {
        console.error('Do you have multiple wallets installed?');
      }

      if (!provider) {
        return this.setError('MetaMask not found');
      }

      this.provider = provider;

      this.provider.on('accountsChanged', this.handleAccountsChanged);

      this.provider.on('disconnect', params => {
        console.log('### metamask disconnect', params);

        this.isAuthorized = false;
        this.address = null;
      });

      const handleChangeNetwork = chainId => {
        this.metamaskChainId = chainId;
      };

      this.provider.on('chainIdChanged', handleChangeNetwork);
      this.provider.on('chainChanged', handleChangeNetwork);

      this.provider
        .request({ method: 'eth_requestAccounts' })
        .then(async params => {
          this.handleAccountsChanged(params);

          // @ts-ignore
          const web3 = new Web3(window.ethereum);
          this.metamaskChainId = await web3.eth.net.getId();

          if (isNew) {
            await this.provider.request({
              method: 'wallet_requestPermissions',
              params: [
                {
                  eth_accounts: {},
                },
              ],
            });
          }

          this.isAuthorized = true;
          this.isInitilized = true;
        })
        .catch(err => {
          if (err.code === 4001) {
            this.isAuthorized = false;
            this.isInitilized = true;
            this.address = null;
            this.syncLocalStorage();
            return this.setError('Please connect to MetaMask.');
          } else {
            console.error(err);
          }
        });
    } catch (e) {
      console.log('### sign in error', e);
      return this.setError(e.message);
    }
  }

  @action.bound
  public switchNetwork = async () => {
    const config = getChainConfig();
    try {
      await this.provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: config.chainId }],
      });

      // await this.tokenBalanceWatcher();
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await this.provider.request({
            method: 'wallet_addEthereumChain',
            params: [config],
          });
        } catch (addError) {
          console.log('### addError', addError);
        }
      } else {
        console.log('### ex', switchError);
      }
    }
  }

  @action.bound
  public syncLocalStorage = () => {
    localStorage.setItem(
      'harmony_metamask_session',
      JSON.stringify({
        address: this.address || "",
      }),
    );
  }

  @action.bound public reset = () => {
    Object.assign(this, defaults);
  }
}
