import { UserStoreMetamask } from './UserStoreMetamask';
import { createStoresContext } from './create-context';

export interface IStores {
  user?: UserStoreMetamask;
}

const stores: IStores = {};

stores.user = new UserStoreMetamask(stores);

//@ts-ignore
window.stores = stores;

const { StoresProvider, useStores } = createStoresContext<typeof stores>();
export { StoresProvider, useStores };

export default stores;