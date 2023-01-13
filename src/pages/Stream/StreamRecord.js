import { useCallback, useEffect, useRef, useState } from "react";
import { Space, SpaceEvent, getUserMedia } from "@mux/spaces-web";
import { startBroadcast, stopBroadcast } from '../../utils';

import { Participant } from "./Participant";

// 🚨 Don’t forget to add your own JWT here!
const JWT = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlBlekdERVhuMk1VMTlGdjAxb2htMDBIMDFBZXhDSzlEaXRHVEY5b3RLMmZaVHcifQ.eyJleHAiOjE2NzQxNDM1NjAsImF1ZCI6InJ0Iiwic3ViIjoiRGtlOEg2N2ZuQ3pFM0VZRElsQnY0bW5JdnYwMWF3bUpQRVUwMWFpWE9YallvIn0.J71jefFHwDPOjKQv2hBGNs0cUN22k_ryD7OmHuaF2OFOlKMKm0VR_vvDMNiiCFLYeNCRYhRoY1dwXEzKj_jE8exrTwX_X-iJJOG0dkZXzQnUdMWOZ2ZVNDZc7gqAn5B3aee9I4omtAGZo8BEv7Fo1nbAh21a0qMip1mc4Cih087fPhKdc398VbwhiQBUigRz203Mcvwo2Z0HH7X5JwJiqH3BBW0h99M_S1qqGkJ6TpV-NMWPU3YEzjw9riKCnInEM-surPmXLYMNDiUM-17b2rTfunUMCRPWlXo4UquKTjuyWf1N-8kr20-ZvqtTnApxumFd3-yqZRu8fC0qCFrzJg";

export function StreamRecord(props) {
    const spaceRef = useRef(null);
    const [localParticipant, setLocalParticipant] = useState(null);
    const [participants, setParticipants] = useState([]);
    const joined = !!localParticipant;

    const [loading, setLoading] = useState(false);

    console.log(111, props);

    const addParticipant = useCallback(
        (participant) => {
            setParticipants((currentParticipants) => [
                ...currentParticipants,
                participant,
            ]);
        },
        [setParticipants]
    );

    const removeParticipant = useCallback(
        (participantLeaving) => {
            setParticipants((currentParticipants) =>
                currentParticipants.filter(
                    (currentParticipant) =>
                        currentParticipant.connectionId !== participantLeaving.connectionId
                )
            );
        },
        [setParticipants]
    );

    useEffect(() => {
        // const space = new Space(JWT);

        // space.on(SpaceEvent.ParticipantJoined, addParticipant);
        // space.on(SpaceEvent.ParticipantLeft, removeParticipant);

        // spaceRef.current = space;

        // return () => {
        //     space.off(SpaceEvent.ParticipantJoined, addParticipant);
        //     space.off(SpaceEvent.ParticipantLeft, removeParticipant);
        // };
    }, [addParticipant, removeParticipant]);

    useEffect(() => {
        const space = new Space(props.ownerCreds.spaceToken);
        spaceRef.current = space;
    }, [props.ownerCreds.spaceToken]);

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

        await startBroadcast({
            spaceId: props.ownerCreds.spaceId,
            broadcastId: props.ownerCreds.broadcastId,
        });

        setLoading(false);
    }, [props.ownerCreds]);

    const stop = useCallback(async () => {
        // Join the Space
        await spaceRef.current.join();

        // Set the local participant so it will be rendered
        setLocalParticipant(null);

        await stopBroadcast({
            spaceId: props.ownerCreds.spaceId,
            broadcastId: props.ownerCreds.broadcastId,
        });
    }, [props.ownerCreds]);

    // const join = useCallback(async () => {
    //     // Join the Space
    //     let localParticipant = await spaceRef.current.join();

    //     // Get and publish our local tracks
    //     let localTracks = await localParticipant.getUserMedia({
    //         audio: true,
    //         video: true,
    //     });
    //     await localParticipant.publishTracks(localTracks);

    //     // Set the local participant so it will be rendered
    //     setLocalParticipant(localParticipant);
    // }, []);

    return (
        <>
            <h4>
                You are the owner of this stream: <span>{props.ownerCreds.liveStreamId}</span>
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