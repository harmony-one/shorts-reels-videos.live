import { UserStoreMetamask } from './UserStoreMetamask';
import { createStoresContext } from './create-context';
import { ActiveStream } from './ActiveStream';
import { ActionModalsStore } from './ActionModals';
import { Chat } from './Chat';

export interface IStores {
  user?: UserStoreMetamask;
  stream?: ActiveStream;
  modals?: ActionModalsStore;
  chat?: Chat;
}

const stores: IStores = {};

stores.user = new UserStoreMetamask(stores);
stores.stream = new ActiveStream(stores);
stores.modals = new ActionModalsStore();
stores.chat = new Chat(stores);

//@ts-ignore
window.stores = stores;

const { StoresProvider, useStores } = createStoresContext<typeof stores>();
export { StoresProvider, useStores };

export default stores;