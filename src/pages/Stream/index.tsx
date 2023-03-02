import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStores } from 'stores';
import { ChatContainer } from "./Chat/ChatContainer";
import { Box } from "grommet";
import { VideoView } from "./VideoView";
import { StreamFooter } from "./Footer";
import { useMediaQuery } from 'react-responsive'
import { getDomainName } from 'utils';

export const Stream = observer(() => {
    const { stream, user, chat } = useStores();
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1024px)' })

    useEffect(() => {
        chat.chatVisible = !isTabletOrMobile;
    }, [isTabletOrMobile]);

    useEffect(() => {
        const name = getDomainName();

        stream.loadStream(name);

        return () => {
            chat.disconnectChat();
            stream.clean();
        }
    }, [user.address])

    if (!stream.isInitilized || !user.isInitilized) {
        return null;
    }

    if (isTabletOrMobile) {
        return (<Box direction="column" fill={true} gap="medium" margin={{ top: 'small' }}>
            {
                chat.chatVisible ?
                    <Box style={{ border: '1px solid #dfdfdf70', borderRadius: 7 }} fill={true}>
                        <ChatContainer />
                    </Box> :
                    <VideoView />
            }

            <Box style={{ borderTop: '1px solid white', minHeight: '70px' }}>
                <StreamFooter />
            </Box>
        </Box>);
    }

    return (<Box direction="row" fill={true} gap="medium" margin={{ top: 'small' }}>
        <Box direction="column" fill={true}>
            <Box fill={true}>
                <VideoView />
            </Box>

            <Box style={{ borderTop: '1px solid white', minHeight: '70px' }}>
                <StreamFooter />
            </Box>
        </Box>

        {
            chat.chatVisible &&
            <Box style={{ border: '1px solid #dfdfdf70', borderRadius: 7, minWidth: '400px' }}>
                <ChatContainer />
            </Box>
        }
    </Box>);
});
