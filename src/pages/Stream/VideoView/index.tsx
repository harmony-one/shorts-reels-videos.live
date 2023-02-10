import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from 'stores';
import { useNavigate } from 'react-router-dom';
import { Box } from 'grommet';
import { Button } from 'components/Button';

export const VideoView = observer(() => {
    const navigate = useNavigate();
    const { stream } = useStores();

    if (stream?.data?.status === 'active') {
        return <Box
            justify='center'
            align='center'
            fill={true}
            style={{
                border: '1px solid #dfdfdf70', borderRadius: 7
            }}
        >
            <h3>Waiting for the stream to start...</h3>
            <Button onClick={() => navigate('/')}>
                Back to the list
            </Button>
        </Box >
    }

    return <Box justify="start">
        <div dangerouslySetInnerHTML={{
            __html: `<mux-player stream-type="live" playback-id="${stream.data.playbackId}" metadata-video-title="Placeholder (optional)" metadata-viewer-user-id="Placeholder (optional)" primary-color="#FFFFFF" secondary-color="#000000" autoplay="true"></mux-player>`
        }} />
    </Box>;
})