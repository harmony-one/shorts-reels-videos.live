import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { StreamRecord } from './StreamRecord';
import { StreamView } from './StreamView';

export const Stream = () => {
    const [initilized, setInitilized] = useState();
    const [ownerCreds, setOwnerCreds] = useState();

    const { id } = useParams();

    useEffect(() => {
        const keyStr = localStorage.getItem('streams');

        if (keyStr) {
            setOwnerCreds(JSON.parse(keyStr)[id]);
        }

        setInitilized(true);
    }, [id])

    return initilized ?
        ownerCreds ?
            <StreamRecord ownerCreds={ownerCreds} /> : <StreamView />
        : 'Loading...'
}
