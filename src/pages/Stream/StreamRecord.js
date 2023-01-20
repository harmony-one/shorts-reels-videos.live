import { useCallback, useEffect, useRef, useState } from "react";
import { Space, SpaceEvent, getUserMedia } from "@mux/spaces-web";
import { getLiveStream, startLiveStream, getLiveStreamToken } from '../../utils';

import { Participant } from "./Participant";
import { useParams } from "react-router-dom";

export function StreamRecord({ stream }) {
    const spaceRef = useRef(null);
    const [localParticipant, setLocalParticipant] = useState(null);
    const [participants, setParticipants] = useState([]);
    const joined = !!localParticipant;

    const [token, setToken] = useState();

    const { id } = useParams();

    const [loading, setLoading] = useState(false);

    // const addParticipant = useCallback(
    //     (participant) => {
    //         setParticipants((currentParticipants) => [
    //             ...currentParticipants,
    //             participant,
    //         ]);
    //     },
    //     [setParticipants]
    // );

    // const removeParticipant = useCallback(
    //     (participantLeaving) => {
    //         setParticipants((currentParticipants) =>
    //             currentParticipants.filter(
    //                 (currentParticipant) =>
    //                     currentParticipant.connectionId !== participantLeaving.connectionId
    //             )
    //         );
    //     },
    //     [setParticipants]
    // );

    useEffect(() => {
        getLiveStreamToken(id).then(res => {
            setToken(res.data);

            const space = new Space(res.data);
            spaceRef.current = space;
        })
    }, [id]);

    const join = useCallback(async () => {
        setLoading(true);

        // Join the Space
        let localParticipant = await spaceRef.current.join();

        // Get and publish our local tracks
        let localTracks = await getUserMedia({
            audio: true,
            video: true,
        });
        await localParticipant.publishTracks(localTracks);

        // Set the local participant so it will be rendered
        setLocalParticipant(localParticipant);

        await startLiveStream(id);

        setLoading(false);
    }, [id]);

    const stop = useCallback(async () => {
        // Join the Space
        // await spaceRef.current.join();

        // // Set the local participant so it will be rendered
        // setLocalParticipant(null);

        // await stopBroadcast({
        //     spaceId: props.ownerCreds.spaceId,
        //     broadcastId: props.ownerCreds.broadcastId,
        // });
    }, [id]);

    if (!stream) {
        return <div>...</div>
    }

    return (
        <>
            <h4>
                You are the owner of this stream: <span style={{ color: '#38b3ff' }}>
                    {stream.title}
                </span>
            </h4>

            {!localParticipant ?
                <div
                    onClick={join}
                    disabled={joined}
                    className="App-button"
                    style={{
                        margin: '20px 0',
                        maxWidth: 300,
                    }}
                >
                    {loading ? 'Starting...' : 'Start Stream'}
                </div> : <div
                    onClick={stop}
                    className="App-button"
                    style={{
                        margin: '20px 0',
                        maxWidth: 300,
                        display: 'none'
                    }}
                >
                    Stop Stream
                </div>}

            {localParticipant && (
                <Participant
                    key={localParticipant.connectionId}
                    participant={localParticipant}
                />
            )}

            {participants.map((participant) => {
                return (
                    <Participant
                        key={participant.connectionId}
                        participant={participant}
                    />
                );
            })}
        </>
    );
}