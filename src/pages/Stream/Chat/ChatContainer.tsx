import React from 'react';
import {
    Chat,
    Channel,
    ChannelHeader,
    MessageList,
    MessageInput,
    Thread,
    Window,
} from 'stream-chat-react';
import '@stream-io/stream-chat-css/dist/css/index.css';
import './stream_chat.css';
import { useStores } from 'stores';
import { observer } from 'mobx-react-lite';

export const ChatContainer = observer(() => {
    const { chat } = useStores();

    if (!chat.client) return null;

    return (
        <Chat client={chat.client} theme="stream_chat_custom">
            {/* <ChannelList filters={filters} sort={sort} options={options} /> */}
            <Channel channel={chat.channel}>
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
});