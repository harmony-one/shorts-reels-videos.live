import React from 'react';
import './App.css';
import { useCallback, useState } from 'react';
import { createSpaceWithBroadcast, deleteLiveStream } from './utils';
import { useNavigate } from 'react-router-dom';

export function Header() {
    const [loading, setLoading] = useState(false);
    const navigator = useNavigate();

    const create = useCallback(() => {
        setLoading(true);

        createSpaceWithBroadcast({}).then(res => {
            const streamsStr = localStorage.getItem('streams');

            const streams = streamsStr ? JSON.parse(streamsStr) : {};

            streams[res.data.liveStreamId] = res.data;

            localStorage.setItem('streams', JSON.stringify(streams));

            setLoading(false);

            navigator(`/streams/${res.data.liveStreamId}`);
        }).finally(() => setLoading(false));
    }, []);

    const remove = useCallback((liveStreamId) => {
        deleteLiveStream({ liveStreamId }).then(res => console.log(res.data));
    }, []);

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
                backgroundColor: "#282c34"
            }}
        >
            <div onClick={() => navigator('/')} className="App-button">
                {"All Streams"}
            </div>
            <div onClick={() => create()} className="App-button">
                {!loading ? "Create new stream" : 'Creating...'}
            </div>
        </div>
    );
}
