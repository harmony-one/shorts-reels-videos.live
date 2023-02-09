import React, { useCallback, useEffect, useRef, useState } from "react";
import { Space, SpaceEvent, getUserMedia } from "@mux/spaces-web";
import { getLiveStream, startLiveStream, getLiveStreamToken } from '../../utils';

import { Participant } from "./Participant";
import { useParams } from "react-router-dom";
import { RecIcon } from "../../icons/RecIcon";

const sleep = (ms) => new Promise(res => setTimeout(res, ms));

export function StreamRecord({ stream, address }) {
    const [space, setSpace] = useState(null);
    const [localParticipant, setLocalParticipant] = useState(null);
    // const [participants, setParticipants] = useState([]);
    const joined = !!localParticipant;

    const { id } = useParams();

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getLiveStreamToken(id).then(res => {
            const newSpace = new Space(res.data);
            setSpace(newSpace);
        })
    }, [id]);

    const join = useCallback(async () => {
        setLoading(true);

        // Join the Space
        let localParticipant = await space.join();

        // Get and publish our local tracks
        let localTracks = await getUserMedia({
            audio: true,
            video: true,
        });
        await localParticipant.publishTracks(localTracks);

        // Set the local participant so it will be rendered
        setLocalParticipant(localParticipant);

        let starting = false;

        // while (!starting) {
        try {
            await startLiveStream(id);
            starting = true;
        } catch (e) {
            //sleep(2000);
        }
        //}

        setLoading(false);
    }, [id, space]);

    const stop = useCallback(async () => {
        // // Set the local participant so it will be rendered
        await space.leave();
        localParticipant.unpublishAllTracks({ stop: true });
        setLocalParticipant(null);

        // await stopBroadcast({
        //     spaceId: props.ownerCreds.spaceId,
        //     broadcastId: props.ownerCreds.broadcastId,
        // });
    }, [localParticipant, id, space]);

    if (!stream) {
        return <div>...</div>
    }

    if (!localParticipant) {
        return (
            <>
                <h4>
                    You are the owner of this stream: <span style={{ color: '#38b3ff' }}>
                        {stream.title}
                    </span>
                </h4>

                {!localParticipant &&
                    <div
                        onClick={join}
                        // disabled={joined}
                        className="App-button"
                        style={{
                            margin: '20px 0',
                            maxWidth: 300,
                        }}
                    >
                        <RecIcon style={{ marginRight: 10, display: loading ? 'none' : 'block' }} />
                        {loading ? 'Starting...' : 'Start Stream'}
                    </div>
                }
            </>)
    }

    return (
        <div>
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%'
            }}>
                <h4>
                    Streaming: <span style={{ color: '#38b3ff' }}>
                        {stream.title}
                    </span>
                </h4>
                <div
                    onClick={stop}
                    className="App-button"
                    style={{
                        margin: '20px 0',
                        maxWidth: 300,
                    }}
                >
                    Stop Stream
                </div>
            </div>

            <Participant
                key={localParticipant.connectionId}
                participant={localParticipant}
            />
        </div>
    );
}