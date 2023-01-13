import { useNavigate, useParams } from 'react-router-dom';
// import MuxVideo from '@mux/mux-video-react';
import { useEffect, useState } from 'react';
import { retrieveLiveStream } from '../../utils';

export const StreamView = () => {
    const [stream, setStream] = useState();

    const { id } = useParams();

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (stream?.status !== 'active') {
                retrieveLiveStream({ liveStreamId: id }).then(res => setStream(res.data));
            }
        }, 4000);

        return () => clearInterval(intervalId);
    }, [id])

    if (stream && stream.status !== 'active') {
        return (<>
            <h3>
                Stream: {id}
            </h3>
            <h3>Waiting for the stream to start...</h3>
        </>)
    }

    return (
        <>
            <h3>
                Stream: {id}
            </h3>

            {
                !!stream?.playback_ids[0]?.id ?
                    <div style={{
                        maxWidth: "100%",
                        width: '1024px',
                        display: 'flex',
                        flexDirection: 'column',
                        marginTop: 0
                    }}>
                        <div dangerouslySetInnerHTML={{
                            __html: `<mux-player stream-type="live" playback-id="${stream.playback_ids[0]?.id}" metadata-video-title="Placeholder (optional)" metadata-viewer-user-id="Placeholder (optional)" primary-color="#FFFFFF" secondary-color="#000000" autoplay="true"></mux-player>`
                        }}>
                        </div>
                    </div> : "Loading..."
            }
        </>
    );
}