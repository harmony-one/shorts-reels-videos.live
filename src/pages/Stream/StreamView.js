import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPaymentLink } from "../../utils";

export const StreamView = ({ stream }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const getPaymentCallback = useCallback(async () => {
        try {
            setLoading(true);

            let accounts = [];

            if (window.ethereum) {
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