import { useNavigate, useParams } from 'react-router-dom';
// import MuxVideo from '@mux/mux-video-react';
import { useEffect, useState } from 'react';
import { retrieveLiveStream } from '../utils';

export const Stream = () => {
    const [stream, setStream] = useState();
    const [key, setKey] = useState();

    const navigator = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        retrieveLiveStream({ liveStreamId: id }).then(res => setStream(res.data));

        const key = localStorage.getItem(id);
        setKey(key);
    }, [id])

    return (
        <div className="App-header">
            <div
                onClick={() => navigator('/')}
                style={{
                    cursor: 'pointer',
                    border: '1px solid white',
                    borderRadius: 5,
                    padding: '10px 20px'
                }}
            >
                {"<- Back to all streams list"}
            </div>

            {key &&
                <div style={{
                    marginTop: '20px',
                    padding: '20px 20px 20px 30px',
                    borderRadius: 5,
                    border: '1px solid white',
                    textAlign: 'left',
                    fontSize: 20,
                    lineHeight: 1.6
                }}>
                    <b style={{ color: 'yellow' }}>You are the owner of this stream</b>
                    <br />
                    <br />
                    Follow these steps to start streaming:
                    <li>
                        Download mobile app {' '}
                        <a style={{ color: "yellow" }} href="https://apps.apple.com/us/app/larix-broadcaster/id1042474385" target="_blank">
                            Larix Broadcaster
                        </a>
                    </li>
                    <li>
                        Create new connection: {"Settings -> Connections -> New connection"}
                    </li>
                    <li>
                        Set stream url: <span style={{ color: "blue" }}>
                            <a style={{ color: "yellow" }} href={`rtmp://global-live.mux.com:5222/app/${key}`} target="_blank">
                                {`rtmp://global-live.mux.com:5222/app/${key}`}
                            </a>
                        </span>
                    </li>
                    <li>
                        Start streaming
                    </li>
                    {/* {`Your stream key: ${key}`} */}
                </div>
            }

            <h2>
                Stream:
            </h2>

            {stream?.playback_ids[0]?.id ?
                <div style={{
                    maxWidth: "100%",
                    width: '800px',
                    display: 'flex',
                    flexDirection: 'column',
                    marginTop: 0
                }}>
                    {/* <MuxVideo
                        style={{ height: '100%', maxWidth: '100%' }}
                        playbackId={stream.playback_ids[0].id}
                        metadata={{
                            video_id: id,
                            video_title: 'Super Interesting Video',
                            viewer_user_id: 'user-id-bc-789',
                        }}
                        streamType="live"
                        controls
                        autoPlay
                        muted
                    /> */}
                    <div dangerouslySetInnerHTML={{
                        __html: `<mux-player stream-type="live" playback-id="${stream.playback_ids[0]?.id}" metadata-video-title="Placeholder (optional)" metadata-viewer-user-id="Placeholder (optional)" primary-color="#FFFFFF" secondary-color="#000000"></mux-player>`
                    }}>
                    </div>
                </div> : 'Stream not found'
            }
        </div>
    );
}
