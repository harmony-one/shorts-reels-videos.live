import React, { useEffect } from 'react';
import './App.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RecIcon } from './icons/RecIcon';
import { Box } from 'grommet';

export function Header() {
    const [loading, setLoading] = useState(false);
    const navigator = useNavigate();
    const [address, setAddress] = useState('');

    const handleAccountsChanged = (accounts) => {
        if (accounts.length) {
            localStorage.setItem('live_profile',
                JSON.stringify({
                    address: accounts[0]
                })
            )

            setAddress(accounts[0])
        } else {
            removeAccounts()
        }
    }

    const removeAccounts = () => {
        localStorage.removeItem('live_profile')
        setAddress('');
    }

    useEffect(() => {
        const profileStr = localStorage.getItem('live_profile');

        const profile = profileStr && JSON.parse(profileStr);

        if (profile?.address) {
            connectMetamask();
        }

        //@ts-ignore
        window.ethereum?.on('accountsChanged', handleAccountsChanged);
    }, []);

    const connectMetamask = () => {
        //@ts-ignore
        if (window.ethereum) {
            //@ts-ignore
            window.ethereum.request({ method: 'eth_requestAccounts' })
                .then(handleAccountsChanged)
                .catch(removeAccounts)
        } else {
            removeAccounts()
        }
    }

    return (
        <Box justify="between" pad="large" wrap={true} background="#282c34">
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div>
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
                </div>
            </div>


            <div style={{ display: 'flex', flexDirection: 'row' }}>
                {window.location.pathname === '/' &&
                    <div
                        onClick={() => navigator('/go-live')}
                        className="App-button"
                    >
                        <RecIcon style={{ marginRight: 10 }} />
                        {!loading ? "Go Live" : '...'}
                    </div>
                }

                <div
                    onClick={() => navigator('/')}
                    className="App-button"
                    style={{ marginLeft: 30 }}
                >
                    {"All Streams"}
                </div>
            </div>
        </Box>
    );
}
