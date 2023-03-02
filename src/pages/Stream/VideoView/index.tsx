import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from 'stores';
import { useNavigate, useParams } from 'react-router-dom';
import { Box } from 'grommet';
import { Button } from 'components/Button';
import { StreamRecord } from '../VideoRecord';
import { DC } from 'one-country-sdk'
import Web3 from 'web3';
import { createLiveStream, getDomainName } from 'utils';

export const VideoView = observer(() => {
    const navigate = useNavigate();
    const { stream, user } = useStores();
    const [domainRenter, setDomainRenter] = useState('');
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        const name = getDomainName();

        const oneCountry = new DC({
            provider: new Web3.providers.HttpProvider('https://api.harmony.one'),
            contractAddress: '0x3C84F4690De96a0428Bc6777f5aA5f5a92150Ef2',
        });

        oneCountry.getRecord(name).then(rec => {
            console.log(name, rec);
            setDomainRenter(rec?.renter);
        });
    }, [user.address]);


    if (user.address &&
        stream.isInitilized &&
        stream.data?.ownerAddress === user.address
    ) {
        return <StreamRecord />
    }

    console.log(domainRenter, user.address);

    if (domainRenter && (domainRenter.toLocaleLowerCase() === user.address.toLowerCase())) {
        return <Box
            justify='center'
            align='center'
            fill={true}
            style={{
                border: '1px solid #dfdfdf70', borderRadius: 7
            }}
        >
            <Button
                disabled={creating}
                onClick={() => {
                    setCreating(true);

                    const name = getDomainName();

                    createLiveStream({
                        title: `${name}-live`,
                        name,
                        aliasName: 'live',
                        ownerAddress: user.address
                    }).finally(() => {
                        setCreating(false);
                        stream.loadStream(name);
                    });
                }}>
                {!creating ? "Create Stream" : "Creating..."}
            </Button>
        </Box >
    }

    if (stream?.data?.status !== 'active') {
        return <Box
            justify='center'
            align='center'
            fill={true}
            style={{
                border: '1px solid #dfdfdf70', borderRadius: 7
            }}
        >
            <h3>Waiting for the stream to start...</h3>
            {/* <Button onClick={() => navigate('/')}>
                Back to the list
            </Button> */}
        </Box >
    }

    return <div style={{ display: 'contents' }}>
        <div style={{ height: "100%" }} dangerouslySetInnerHTML={{
            __html: `<mux-player stream-type="live" playback-id="${stream.data.playbackId}" metadata-video-title="Placeholder (optional)" metadata-viewer-user-id="Placeholder (optional)" primary-color="#FFFFFF" secondary-color="#000000" autoplay="true"></mux-player>`
        }} />
    </div>;
})