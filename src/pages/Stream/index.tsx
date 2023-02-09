import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { StreamRecord } from './StreamRecord';
import { StreamView } from './StreamView';
import { getLiveStream } from '../../utils';

export const Stream = () => {
    const [initilized, setInitilized] = useState(false);
    const [address, setAddress] = useState('');
    const [stream, setStream] = useState(null);

    const navigate = useNavigate();

    const { id } = useParams();

    useEffect(() => {
        const intervalId = setInterval(() => {
            getLiveStream(id, address).then(res => setStream(res.data));
        }, 4000);

        // if (address) {
            getLiveStream(id, address).then(res => setStream(res.data));
        //}

        return () => clearInterval(intervalId);
    }, [id, address])

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
        setAddress('')
    }

    useEffect(() => {
        const profileStr = localStorage.getItem('live_profile');

        const profile = profileStr && JSON.parse(profileStr);

        if (profile?.address) {
            connectMetamask();
        }

        setInitilized(true);

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

    // if (!address) {
    //     return <div style={{
    //         marginTop: 100
    //     }}>
    //         <h3>To join <span style={{ color: '#38b3ff' }}>{stream?.title}</span> stream, you must sign in to the metamask</h3>
    //     </div>
    // }

    return <>
        {stream && initilized ?
            address && address === stream.ownerAddress ?
                <StreamRecord stream={stream} address={address} /> : 
                <StreamView stream={stream} address={address} />
            : '...'
        }
    </>
}
