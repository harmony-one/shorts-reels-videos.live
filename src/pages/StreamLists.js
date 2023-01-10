import { useCallback, useEffect, useState } from 'react';
import { createLiveStream, retrieveLiveStreams, deleteLiveStream } from '../utils';
import { useNavigate } from 'react-router-dom';

export const StreamList = () => {
    const [streamsList, setStreamsList] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const create = useCallback(() => {
        setLoading(true);

        createLiveStream({}).then(res => {
            localStorage.setItem(res.data.id, res.data.stream_key);

            console.log(res.data)
            setLoading(false);

            navigate(`/streams/${res.data.id}`);
        }).finally(() => setLoading(false));
    }, []);

    const remove = useCallback((liveStreamId) => {
        deleteLiveStream({ liveStreamId }).then(res => console.log(res.data));
    }, []);

    useEffect(() => {
        retrieveLiveStreams({}).then(res => setStreamsList(res.data));
    }, []);

    console.log(streamsList);

    return (
        <div className="App-header">
            <div
                onClick={() => !loading && create()}
                style={{
                    cursor: 'pointer',
                    border: '1px solid white',
                    borderRadius: 5,
                    padding: '10px 20px'
                }}
            >
                {loading ? 'Creating...' : 'Create New Live Stream'}
            </div>

            <h2>
                Live Streams:
            </h2>

            <div style={{
                maxWidth: "100%",
                width: '800px',
                display: 'flex',
                flexDirection: 'column'
            }}>
                {
                    streamsList.map(stream => {
                        return (
                            <div
                                key={stream.id}
                                style={{
                                    cursor: 'pointer',
                                    border: '1px solid white',
                                    borderRadius: 5,
                                    padding: '10px 20px',
                                    margin: '20px 0px',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between'
                                }}
                                onClick={() => navigate(`/streams/${stream.id}`)}
                                // onClick={() => remove(stream.id)}
                            >
                                {`Created ${new Date(stream.created_at * 1000).toLocaleString("en-US")}`}
                                <span style={{ marginLeft: 30 }}>
                                    {"Watch ->"}
                                </span>
                            </div>
                        )
                    })
                }
            </div>
        </div >
    );
}
