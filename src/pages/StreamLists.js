import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { retrieveLiveStreams, deleteLiveStream, deleteSpace } from '../utils';

export const StreamList = () => {
    const [streamsList, setStreamsList] = useState([]);
    const [deleting, setDeleting] = useState(false);

    const navigate = useNavigate();

    const loadStreams = useCallback(async () => {
        return await retrieveLiveStreams({}).then(res => setStreamsList(res.data));
    });

    const removeStream = useCallback(async (liveStreamId) => {
        setDeleting(liveStreamId);

        try {

            const streamsStr = localStorage.getItem('streams');

            const streamCreds = streamsStr && JSON.parse(streamsStr)[liveStreamId];

            await deleteLiveStream({ liveStreamId });

            if (streamCreds) {
                await deleteSpace({ spaceId: streamCreds.spaceId });
            }
        } catch (e) {
            console.error(e);
        }

        await loadStreams();

        setDeleting(null);
    })

    useEffect(() => {
        loadStreams();
    }, []);

    return (
        <>
            <h2>
                Live Streams:
            </h2>

            {streamsList.length ? <div style={{
                maxWidth: "100%",
                width: '800px',
                display: 'flex',
                flexDirection: 'column'
            }}>
                {streamsList.map(stream => {
                    return (
                        <div
                            key={stream.id}
                            style={{
                                margin: '20px 0px',
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-around',
                                alignItems: 'center'
                            }}>
                            <div
                                style={{
                                    cursor: 'pointer',
                                    border: '1px solid white',
                                    borderRadius: 5,
                                    padding: '10px 20px',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between'
                                }}
                                onClick={() => navigate(`/streams/${stream.id}`)}
                            >
                                {`Created ${new Date(stream.created_at * 1000).toLocaleString("en-US")}`}
                                <span style={{ marginLeft: 30 }}>
                                    {"Watch ->"}
                                </span>
                            </div>
                            <span
                                onClick={() => removeStream(stream.id)}
                                style={{
                                    cursor: 'pointer'
                                }}
                            >
                                {deleting === stream.id ? "Deleting..." : "Delete"}
                            </span>
                        </div>
                    )
                })}
            </div> : "Loading..."}
        </>
    );
}
