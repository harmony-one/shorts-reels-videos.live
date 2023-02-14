import { action, computed, makeAutoObservable, makeObservable, observable } from 'mobx';
import { StreamChat } from 'stream-chat';
import { IStores } from 'stores';

export class Chat {
    public stores: IStores;

    @observable channel;
    @observable client;

    @observable chatVisible = true;

    constructor(stores) {
        this.stores = stores;

        makeAutoObservable(this);
    }

    @action.bound
    toggleChatVisible = () => {
        this.chatVisible = !this.chatVisible;
    }

    @action.bound
    connectChat = () => {
        const newClient = new StreamChat('uqxm3pdrrhju');

        const handleConnectionChange = ({ online = false }) => {
            if (!online) return console.log('connection lost');
            this.client = newClient;
        };

        this.channel = newClient.getChannelById('livestream', '2', {});

        newClient.on('connection.changed', handleConnectionChange);

        // newClient.connectUser(
        //     {
        //         id: 'dave-matthews',
        //         name: 'Dave Matthews',
        //     },
        //     'your_user_token',
        // );

        newClient.connectUser(
            {
                id: 'john',
                name: 'John Doe',
                image: 'https://getstream.io/random_svg/?name=John',
            },
            newClient.devToken('john'),
        );
    };

    @action.bound
    disconnectChat = () => {
        if (this.client) {
            this.client.off('connection.changed', () => {
                this.client = null
            });
            this.client.disconnectUser().then(() => console.log('connection closed'));
        }
    }
}