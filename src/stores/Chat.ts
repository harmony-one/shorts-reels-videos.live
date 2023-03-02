import { action, autorun, makeAutoObservable, makeObservable, observable } from 'mobx';
import { StreamChat } from 'stream-chat';
import { IStores } from 'stores';
import { joinChat } from 'utils';

interface IConnectParams {
    apiKey: string;
    user: {
        token: string;
        name: string;
        id: string;
    };
    channelId: string;
}

export class Chat {
    public stores: IStores;

    @observable channel;
    @observable client;

    @observable chatVisible = true;

    constructor(stores) {
        this.stores = stores;

        makeAutoObservable(this);

        autorun(() => {
            if (
                this.stores.user.address &&
                this.stores.stream.data?.id &&
                this.stores.user.chatApiKey &&
                !this.client
            ) {
                this.connectChat({
                    apiKey: this.stores.user.chatApiKey,
                    user: {
                        name: this.stores.user.address,
                        id: this.stores.user.address,
                        token: this.stores.user.chatUserToken,
                    },
                    channelId: this.stores.stream.data.name
                })
            }
        });
    }

    @action.bound
    toggleChatVisible = () => {
        this.chatVisible = !this.chatVisible;
    }

    @action.bound
    connectChat = async (params: IConnectParams) => {
        console.log('connectChat');

        const newClient = new StreamChat(params.apiKey);

        const handleConnectionChange = ({ online = false }) => {
            if (!online) return console.log('connection lost');
            this.client = newClient;
        };

        this.channel = newClient.getChannelById('livestream', params.channelId, {});

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
                id: params.user.id,
                name: params.user.name,
                // image: `https://getstream.io/random_svg/?name=`,
            },
            params.user.token
            // newClient.devToken('john'),
        );

        await joinChat(params.channelId, params.user.id);
    };

    @action.bound
    disconnectChat = () => {
        console.log('disconnectChat');
        const disconnectedClinet = this.client;

        this.client = null;

        if (disconnectedClinet) {
            disconnectedClinet.off('connection.changed', () => {
                // this.client = null
            });
            disconnectedClinet.disconnectUser().then(() => {
                console.log('connection closed');
            });
        }
    }
}