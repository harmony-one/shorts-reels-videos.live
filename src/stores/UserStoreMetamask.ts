import { action, autorun, computed, observable } from 'mobx';
import detectEthereumProvider from '@metamask/detect-provider';
import { StoreConstructor } from './core/StoreConstructor';
import Web3 from 'web3';
import { getChainConfig } from './helpers';

const defaults = {};

export class UserStoreMetamask extends StoreConstructor {
  @observable public isAuthorized: boolean;
  @observable error: string = '';

  @observable public isMetaMask = false;
  private provider: any;

  @observable public balance = '0';
  @observable public ethAddress: string;

  @observable metamaskChainId = 0;

  constructor(stores) {
    super(stores);

    setInterval(() => this.updateBalance(), 3 * 1000);

    const session = localStorage.getItem('harmony_metamask_session');

    const sessionObj = JSON.parse(session);

    if (sessionObj && sessionObj.ethAddress) {
      this.signIn();
    }

    autorun(() => {
      if (this.isNetworkActual) {
        this.signIn();
      }
    });
  }

  @computed public get isNetworkActual() {
    return true;
    // const config = this.stores.exchange.getChainConfig();

    // return numberToHex(Number(this.metamaskChainId)) === config.chainId;
  }

  @action.bound
  async updateBalance() {
    const balanceHex = await this.provider.request({
      method: 'eth_getBalance',
      params: [this.ethAddress, 'latest'],
    });

    const balance = Number(balanceHex);
    this.balance = balance.toString();
  }

  @action.bound
  handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
      return this.setError('Please connect to MetaMask');
    } else {
      this.ethAddress = accounts[0];

      try {
        this.updateBalance();
      } catch (err) {
        console.log('### err', err);
      }

      this.syncLocalStorage();
    }
  }

  @action.bound
  setError(error: string) {
    this.error = error;
    this.isAuthorized = false;
  }

  @action.bound
  public async signOut() {
    console.log('### metamask signout');

    this.isAuthorized = false;
    this.ethAddress = '';

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
  public async signIn(isNew = false) {
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
        this.ethAddress = null;
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
        })
        .catch(err => {
          if (err.code === 4001) {
            this.isAuthorized = false;
            this.ethAddress = null;
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

  @action
  public async switchNetwork() {
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

  public syncLocalStorage() {
    localStorage.setItem(
      'harmony_metamask_session',
      JSON.stringify({
        ethAddress: this.ethAddress,
      }),
    );
  }

  @action public reset() {
    Object.assign(this, defaults);
  }
}
