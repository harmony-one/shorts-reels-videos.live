import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPaymentLink } from "../../utils";
import { ChatContainer } from "./ChatContainer";
import { likeLiveStream } from '../../utils';

import { BiDonateHeart } from '@react-icons/all-files/bi/BiDonateHeart';
import { BiChat } from '@react-icons/all-files/bi/BiChat';
import { AiOutlineHeart } from '@react-icons/all-files/ai/AiOutlineHeart';
import { AiFillHeart } from '@react-icons/all-files/ai/AiFillHeart';

export const StreamView = ({ stream, address }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [chat, setChat] = useState(true);
    const [error, setError] = useState('');
    const [likes, setLikes] = useState(stream.totalLikes || 0);

    const getPaymentCallback = useCallback(async () => {
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

            const res = await getPaymentLink(stream.id, accounts[0]);

            window.open(res.data.paymentUrl);
            // navigator(res.data.paymentUrl);
        } catch (err) {
            setError(err?.message);
        }

        setLoading(false);
    }, [stream]);

    return (<div className="content">
        <div
            style={{
                maxWidth: "100%",
                width: '1400px',
                display: 'flex',
                flexDirection: 'row',
                border: '1px solid white',
                borderRadius: '10px',
                overflow: 'hidden',
                marginTop: 30,
            }}
        >
            <div style={{
                maxWidth: "100%",
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                marginTop: 0,
                justifyContent: 'space-between'
            }}>
                <div className="stream-header">
                    <h3 style={{ margin: 0 }}>
                        Streaming: <span style={{ color: '#38b3ff' }}>{stream.title}</span>
                    </h3>
                </div>
                {stream && stream?.status !== 'active' ?
                    <div style={{
                        maxWidth: "100%",
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        border: '1px solid white',
                        minHeight: '500px'
                    }}>
                        <h3>Waiting for the stream to start...</h3>
                        <div onClick={() => navigate('/')} className="App-button">
                            Back to the list
                        </div>
                    </div> :
                    <div dangerouslySetInnerHTML={{
                        __html: `<mux-player stream-type="live" playback-id="${stream.playbackId}" metadata-video-title="Placeholder (optional)" metadata-viewer-user-id="Placeholder (optional)" primary-color="#FFFFFF" secondary-color="#000000" autoplay="true"></mux-player>`
                    }}>
                    </div>
                }

                <div className="stream-footer">
                    <div onClick={() => {
                        setLikes(likes + 1);
                        likeLiveStream(stream.id, address);
                    }}
                        className="App-button"
                    >
                        <AiOutlineHeart color="#38b3ff" />
                        <span style={{
                            color: '#38b3ff',
                            margin: '0 0 1px 5px',
                            fontSize: 18
                        }}>
                            {likes}
                        </span>
                    </div>

                    <div
                        onClick={() => {
                            // likeLiveStream();
                        }}
                        className="App-button"
                        style={{
                            marginLeft: 20
                        }}
                    >
                        <BiDonateHeart color="#38b3ff" />
                    </div>
                    <div
                        onClick={() => setChat(!chat)}
                        className="App-button"
                        style={{
                            marginLeft: 20
                        }}
                    >
                        <BiChat color="#38b3ff" />
                    </div>
                </div>
            </div>

            {
                chat &&
                <div>
                    <ChatContainer />
                </div>
            }
        </div>
    </div>);


    if (stream && stream.hasSubscription === false) {
        return <div style={{
            marginTop: 100
        }}>
            <h3>
                <span style={{ color: '#38b3ff' }}>{stream.title}</span>
            </h3>

            <h3>You need to pay to watch this stream.</h3>

            <div onClick={() => getPaymentCallback()} className="App-button">
                Pay $0.5
            </div>
        </div>
    }

    // You need to pay to watch this stream.

    if (stream && stream.status !== 'active') {
        return (<>
            <h3>
                <span style={{ color: '#38b3ff' }}>{stream.title}</span>
            </h3>
            <h3>Waiting for the stream to start...</h3>
            <div onClick={() => navigate('/')} className="App-button">
                Back to the list
            </div>
        </>)
    }

    return (
        <>
            <h3>
                Streaming: <span style={{ color: '#38b3ff' }}>{stream.title}</span>
            </h3>

            {
                !!stream?.playbackId ?
                    <div style={{
                        maxWidth: "100%",
                        width: '1024px',
                        display: 'flex',
                        flexDirection: 'column',
                        marginTop: 0
                    }}>
                        <div dangerouslySetInnerHTML={{
                            __html: `<mux-player stream-type="live" playback-id="${stream.playbackId}" metadata-video-title="Placeholder (optional)" metadata-viewer-user-id="Placeholder (optional)" primary-color="#FFFFFF" secondary-color="#000000" autoplay="true"></mux-player>`
                        }}>
                        </div>
                    </div> : "..."
            }
        </>
    );
}