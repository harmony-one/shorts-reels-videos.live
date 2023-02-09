import { useCallback, useEffect, useRef } from "react";
import {
  LocalParticipant,
  ParticipantEvent,
  TrackSource,
} from "@mux/spaces-web";

export const Participant = ({ participant }) => {
  const mediaEl = useRef(null);
  const isLocal = participant instanceof LocalParticipant;

  const attachTrack = useCallback((track) => {
    track.attach(mediaEl.current);
  }, []);

  const detachTrack = useCallback((track) => {
    track.detach(mediaEl.current);
  }, []);

  useEffect(() => {
    if (!mediaEl.current) return;

    const microphoneTrack = participant
      .getAudioTracks()
      .find((audioTrack) => audioTrack.source === TrackSource.Microphone);

    const cameraTrack = participant
      .getVideoTracks()
      .find((videoTrack) => videoTrack.source === TrackSource.Camera);

    if (microphoneTrack) {
      attachTrack(microphoneTrack);
    }

    if (cameraTrack) {
      attachTrack(cameraTrack);
    }

    participant.on(ParticipantEvent.TrackSubscribed, attachTrack);
    participant.on(ParticipantEvent.TrackUnsubscribed, detachTrack);

    return () => {
      participant.off(ParticipantEvent.TrackSubscribed, attachTrack);
      participant.off(ParticipantEvent.TrackUnsubscribed, detachTrack);
    };
  }, [participant, attachTrack, detachTrack]);

  // const toggleFullScreen = () => {
  //   var el = mediaEl.current;
  //   if (el.requestFullscreen) {
  //     el.requestFullscreen();
  //   } else if (el.msRequestFullscreen) {
  //     el.msRequestFullscreen();
  //   } else if (el.mozRequestFullScreen) {
  //     el.mozRequestFullScreen();
  //   } else if (el.webkitRequestFullscreen) {
  //     el.webkitRequestFullscreen();
  //   }
  // };

  return (
    <div>
      {/* <h2>{participant.connectionId}</h2> */}
      <video
        ref={mediaEl}
        autoPlay
        playsInline
        muted={isLocal}
        controls
        style={{ width: "1024px", height: "auto", maxWidth: '100vw' }}
      />
    </div>
  );
};