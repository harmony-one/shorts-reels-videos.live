import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { StreamRecord } from './StreamRecord';
import { StreamView } from './StreamView';
import { getLiveStream } from '../../utils';

export const Stream = () => {
    const [initilized, setInitilized] = useState();
    const [address, setAddress] = useState('');
    const [stream, setStream] = useState();

    const navigate = useNavigate();

    const { id } = useParams();

    useEffect(() => {
        const intervalId = setInterval(() => {
            getLiveStream(id).then(res => setStream(res.data));
        }, 4000);

        getLiveStream(id).then(res => setStream(res.data));

        return () => clearInterval(intervalId);
    }, [id])

    useEffect(() => {
        const profileStr = localStorage.getItem('live_profile');

        const profile = profileStr && JSON.parse(profileStr);

        setAddress(profile?.address);

        setInitilized(true);
    }, []);

    return <>
        {stream && initilized ?
            address && address === stream.ownerAddress ?
                <StreamRecord stream={stream} /> : <StreamView stream={stream} />
            : '...'
        }
    </>
}
