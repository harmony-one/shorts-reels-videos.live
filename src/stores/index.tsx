import { UserStoreMetamask } from './UserStoreMetamask';
import { createStoresContext } from './create-context';

export interface IStores {
  userMetamask?: UserStoreMetamask;
}

const stores: IStores = {};

stores.userMetamask = new UserStoreMetamask(stores);

//@ts-ignore
window.stores = stores;

const { StoresProvider, useStores } = createStoresContext<typeof stores>();
export { StoresProvider, useStores };

export default stores;