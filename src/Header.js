import React, { useEffect } from 'react';
import './App.css';
import { useCallback, useState } from 'react';
import { deleteLiveStream } from './utils';
import { useNavigate } from 'react-router-dom';
import { createLiveStream } from './utils/api';

export function Header() {
    const [loading, setLoading] = useState(false);
    const navigator = useNavigate();
    const [address, setAddress] = useState('');

    useEffect(() => {
        const profileStr = localStorage.getItem('live_profile');

        const profile = profileStr && JSON.parse(profileStr);

        setAddress(profile?.address);
    }, []);

    const create = useCallback(() => {
        setLoading(true);

        createLiveStream({ title: 'stream 1', ownerAddress: '0x0' }).then(res => {
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

    const connectMetamask = () => {
        if (window.ethereum) {
            window.ethereum.request({ method: 'eth_requestAccounts' })
                .then(accounts => {
                    if (accounts.length) {
                        localStorage.setItem('live_profile',
                            JSON.stringify({
                                address: accounts[0]
                            })
                        )
                    }

                    setAddress(accounts[0])
                })
        }
    }

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
                backgroundColor: "#282c34"
            }}
        >
            {/* <div onClick={() => navigator('/')} className="App-button">
                {"All Streams"}
            </div> */}
            {/* {window.location.pathname === '/' &&
                <div onClick={() => create()} className="App-button">
                    {!loading ? "Go Live" : '...'}
                </div>} */}

            {
                address ?
                    <div className='App-address'>
                        Your address: <span style={{ color: '#38b3ff' }}>
                            {address.slice(0, 8)}...{address.slice(35)}
                        </span>
                    </div> :
                    <div onClick={() => connectMetamask()} className="App-button">
                        Connect to Metamask
                    </div>
            }

            {window.location.pathname === '/' &&
                <div onClick={() => navigator('/go-live')} className="App-button">
                    {!loading ? "Go Live" : '...'}
                </div>
            }
        </div>
    );
}
