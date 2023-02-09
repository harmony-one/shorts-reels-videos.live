import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteLiveStream, getLiveStreams } from '../utils';

import { MdDeleteForever } from '@react-icons/all-files/md/MdDeleteForever';
import { AiOutlineLoading3Quarters } from '@react-icons/all-files/ai/AiOutlineLoading3Quarters'

export const StreamList = () => {
    const [streamsList, setStreamsList] = useState([]);
    const [deleting, setDeleting] = useState(false);

    const navigate = useNavigate();

    const loadStreams = useCallback(async () => {
        return await getLiveStreams().then(res => setStreamsList(res.data));
    }, []);

    const removeStream = useCallback(async (liveStreamId) => {
        setDeleting(liveStreamId);

        try {
            await deleteLiveStream(liveStreamId);
        } catch (e) {
            console.error(e);
        }

        await loadStreams();

        setDeleting(null);
    }, [])

    useEffect(() => {
        const intervalId = setInterval(() => {
            loadStreams();
        }, 5000)

        loadStreams();

        return () => clearInterval(intervalId)
    }, []);

    return (
        <div className="content" style={{ flexDirection: 'column' }}>
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
                                margin: '20px 20px',
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
                                    justifyContent: 'space-between',
                                    alignItems: 'space-between',
                                    width: 600
                                    // minWidth: 600
                                }}
                            >
                                <div style={{
                                    flexDirection: "column",
                                    display: 'flex',
                                    alignItems: 'space-around',
                                    justifyContent: 'space-around'
                                }}>
                                    <div style={{ color: '#38b3ff', textAlign: 'start' }}>
                                        {stream.title}
                                    </div>
                                    <div style={{ fontSize: 17, textAlign: 'start' }}>
                                        {`Status ${stream.status === "active" ? 'active' : 'waiting'}`}
                                    </div>
                                    <div style={{ fontSize: 17, textAlign: 'start' }}>
                                        {`Created ${new Date(stream.createdAt).toLocaleString("en-US")}`}
                                    </div>
                                </div>

                                <div
                                    className="App-button"
                                    onClick={() => true && navigate(`/streams/${stream.id}`)}
                                    style={{
                                        opacity: true ? 1 : 0.3,
                                    }}
                                >
                                    {"Stream"}
                                </div>
                            </div>
                            <span
                                onClick={() => removeStream(stream.id)}
                                style={{
                                    cursor: 'pointer',
                                    marginLeft: 20
                                }}
                            >
                                {
                                    deleting === stream.id ?
                                        "..."
                                        : <MdDeleteForever size="30" />
                                }
                            </span>
                        </div>
                    )
                })}
            </div> : "..."}
        </div>
    );
}
