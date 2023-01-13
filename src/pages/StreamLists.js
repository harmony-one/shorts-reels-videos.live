import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { retrieveLiveStreams } from '../utils';

export const StreamList = () => {
    const [streamsList, setStreamsList] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        retrieveLiveStreams({}).then(res => setStreamsList(res.data));
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
                        >
                            {`Created ${new Date(stream.created_at * 1000).toLocaleString("en-US")}`}
                            <span style={{ marginLeft: 30 }}>
                                {"Watch ->"}
                            </span>
                        </div>
                    )
                })}
            </div> : "Loading..."}
        </>
    );
}
