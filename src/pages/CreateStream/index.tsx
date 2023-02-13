import { Button } from 'components/Button';
import { TextInput } from 'grommet';
import React from 'react';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RecIcon } from '../../icons/RecIcon';
import { createLiveStream } from '../../utils/api';

export function CreateStream(props) {
    const [loading, setLoading] = useState(false);

    const [title, setTitle] = useState('');
    const [name, setName] = useState('');
    const [aliasName, setAliasName] = useState('');

    const [error, setError] = useState('');
    const navigator = useNavigate();

    const create = useCallback(async () => {
        try {
            setLoading(true);

            let accounts = [];

            //@ts-ignore
            if (window.ethereum) {
                //@ts-ignore
                accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            }

            if (!accounts[0]) {
                throw new Error('Metamask not authorised');
            }

            const res = await createLiveStream({
                title,
                name,
                aliasName,
                ownerAddress: accounts[0]
            });

            navigator(`/streams/${res.data.id}`);
        } catch (err) {
            setError(err?.message);
        }

        setLoading(false);
    }, [title, name, aliasName]);

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
            marginTop: 100
        }}>
            <h3>
                stream address:
            </h3>

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 30
                }}>
                    <div>
                        {"https://"}
                    </div>
                    <div>
                        <TextInput
                            className='small-input'
                            disabled={loading}
                            value={name}
                            onChange={event => setName(event.target.value)}
                        />
                    </div>
                    <div>
                        {".1.country/"}
                    </div>
                    <div>
                        <TextInput
                            className='small-input'
                            disabled={loading}
                            value={aliasName}
                            onChange={event => setAliasName(event.target.value)}
                        />
                    </div>
                </div>

                <h3>
                    stream name:
                </h3>

                <TextInput
                    disabled={loading}
                    value={title}
                    onChange={event => {
                        setTitle(event.target.value);
                    }}
                >
                </TextInput>
            </div>

            <Button
                onClick={() => create()}
                style={{ marginTop: 50 }}
            >
                <RecIcon style={{ marginRight: 10, display: loading ? 'none' : 'block' }} />
                {!loading ? "Go Live" : '...'}
            </Button>
        </div>
    );
}