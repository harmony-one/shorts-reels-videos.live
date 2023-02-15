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
import { Box, Text } from 'grommet';
import { MetamaskButton } from 'components/MetamaskButton';

export const ChatContainer = observer(() => {
    const { chat, user } = useStores();

    if (!user.address) {
        return <Box pad="large" fill={true} align="center" justify="center" gap="30px">
            <MetamaskButton
                active={true}
                onClick={() => user.signIn()}
            />

            <Text size="18px" weight="bold" textAlign="center">
                Connect your MetaMask wallet to get chat access
            </Text>
        </Box>
    }

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