import { useNavigate } from "react-router-dom";

export const StreamView = ({ stream }) => {
    const navigate = useNavigate();

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