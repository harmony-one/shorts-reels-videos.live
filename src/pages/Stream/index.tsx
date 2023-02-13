import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStores } from 'stores';
import { ChatContainer } from "./Chat/ChatContainer";
import { Box } from "grommet";
import { VideoView } from "./VideoView";
import { StreamFooter } from "./Footer";
import { useMediaQuery } from 'react-responsive'

export const Stream = observer(() => {
    const { stream, user } = useStores();
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1024px)' })

    const { id } = useParams();

    useEffect(() => {
        stream.chatVisible = !isTabletOrMobile;
    }, [isTabletOrMobile]);

    useEffect(() => {
        stream.loadStream(id);

        return () => stream.clean();
    }, [id])

    if (!stream.isInitilized || !user.isInitilized) {
        return null;
    }

    if (isTabletOrMobile) {
        return (<Box direction="column" fill={true} gap="medium" margin={{ top: 'small' }}>
            {
                !stream.chatVisible && <VideoView />
            }

            <Box style={{ borderTop: '1px solid white', minHeight: '70px' }}>
                <StreamFooter />
            </Box>

            {
                stream.chatVisible &&
                <Box style={{ border: '1px solid #dfdfdf70', borderRadius: 7 }} fill={true}>
                    <ChatContainer />
                </Box>
            }
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
            stream.chatVisible &&
            <Box style={{ border: '1px solid #dfdfdf70', borderRadius: 7, minWidth: '400px' }}>
                <ChatContainer />
            </Box>
        }
    </Box>);
});
