import React, { useCallback, useEffect, useState } from 'react';
import { getLiveStreams } from 'utils';
import { Box } from 'grommet';
import { StreamPreview } from './StreamPreview';

export const StreamList = () => {
    const [streamsList, setStreamsList] = useState([]);

    const loadStreams = useCallback(async () => {
        return await getLiveStreams().then(res => setStreamsList(res.data));
    }, []);

    useEffect(() => {
        const intervalId = setInterval(() => {
            loadStreams();
        }, 5000)

        loadStreams();

        return () => clearInterval(intervalId)
    }, []);

    return (
        <Box align="center" justify="center" pad={{ top: 'large' }}>
            <h2>
                Live Streams:
            </h2>

            {streamsList.length ? <Box width='800px'>
                {streamsList.map(stream =>
                    <StreamPreview
                        key={stream.id}
                        stream={stream}
                        onRemove={loadStreams}
                    />
                )}
            </Box> : "..."}
        </Box>
    );
}
