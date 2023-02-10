import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStores } from 'stores';
import { ChatContainer } from "./Chat/ChatContainer";
import { Box } from "grommet";
import { VideoView } from "./VideoView";
import { StreamFooter } from "./Footer";

export const Stream = observer(() => {
    const { stream, user } = useStores();

    const { id } = useParams();

    useEffect(() => {
        stream.loadStream(id);

        return () => stream.clean();
    }, [id])

    if (!stream.isInitilized || !user.isInitilized) {
        return null;
    }

    return (<Box direction="row" fill={true} gap="medium" margin={{ top: 'small' }}>
        <Box direction="column" fill={true}>
            <VideoView />

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
