import { UserStoreMetamask } from './UserStoreMetamask';
import { createStoresContext } from './create-context';
import { ActiveStream } from './ActiveStream';

export interface IStores {
  user?: UserStoreMetamask;
  stream?: ActiveStream;
}

const stores: IStores = {};

stores.user = new UserStoreMetamask(stores);
stores.stream = new ActiveStream(stores);

//@ts-ignore
window.stores = stores;

const { StoresProvider, useStores } = createStoresContext<typeof stores>();
export { StoresProvider, useStores };

export default stores;