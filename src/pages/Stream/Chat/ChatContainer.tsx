import React, { useEffect, useState } from 'react';
import { StreamChat } from 'stream-chat';
import {
    Chat,
    Channel,
    ChannelHeader,
    ChannelList,
    MessageList,
    MessageInput,
    Thread,
    Window,
} from 'stream-chat-react';
import '@stream-io/stream-chat-css/dist/css/index.css';
import './stream_chat.css';

const filters = {
    type: 'livestream',
    id: '1'
};

const options = { state: true, presence: false, limit: 10 };
const sort = { last_message_at: -1 };

export const ChatContainer = () => {
    const [client, setClient] = useState(null);
    const [channel, setChannel] = useState(null);

    useEffect(() => {
        const newClient = new StreamChat('uqxm3pdrrhju');

        const handleConnectionChange = ({ online = false }) => {
            if (!online) return console.log('connection lost');
            setClient(newClient);
        };

        const existingChannel = newClient.getChannelById('livestream', '2', {});
        setChannel(existingChannel);

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

        return () => {
            newClient.off('connection.changed', handleConnectionChange);
            newClient.disconnectUser().then(() => console.log('connection closed'));
        };
    }, []);

    if (!client) return null;

    return (
        <Chat client={client} theme='stream_chat_custom'>
            {/* <ChannelList filters={filters} sort={sort} options={options} /> */}
            <Channel channel={channel}>
                <Window>
                    <ChannelHeader />
                    <MessageList
                        noGroupByUser={true}
                        disableDateSeparator={true}
                        hideDeletedMessages={true}
                    />
                    <MessageInput />
                </Window>
                <Thread />
            </Channel>
        </Chat>
    );
};