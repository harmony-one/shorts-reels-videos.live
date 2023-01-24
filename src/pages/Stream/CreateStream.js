import React from 'react';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RecIcon } from '../../icons/RecIcon';
import { createLiveStream } from '../../utils/api';

export function CreateStream(props) {
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState('');
    const [error, setError] = useState('');
    const navigator = useNavigate();

    const create = useCallback(async () => {
        try {
            setLoading(true);

            let accounts = [];

            if (window.ethereum) {
                accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            }

            if (!accounts[0]) {
                throw new Error('Metamask not authorised');
            }

            const res = await createLiveStream({ title, ownerAddress: accounts[0] });

            navigator(`/streams/${res.data.id}`);
        } catch (err) {
            setError(err?.message);
        }

        setLoading(false);
    }, [title]);

    if (error) {
        return <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            marginTop: 150,
            color: 'red'
        }}>
            Creation failed: {error}

            <div
                onClick={() => setError('')}
                className="App-button"
                style={{ marginTop: 30 }}
            >
                Try again
            </div>
        </div>
    }

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            marginTop: 150
        }}>
            <h3>
                stream name:
            </h3>

            <div>
                <input
                    disabled={loading}
                    value={title}
                    onChange={event => {
                        setTitle(event.target.value);
                    }}
                >
                </input>
            </div>

            <div
                onClick={() => create()}
                className="App-button"
                style={{ marginTop: 30 }}
            >
                <RecIcon style={{ marginRight: 10, display: loading ? 'none' : 'block' }} />
                {!loading ? "Go Live" : '...'}
            </div>
        </div>
    );
}