import React, { useCallback, useEffect, useRef } from "react";
import {
  LocalParticipant,
  ParticipantEvent,
  TrackSource,
} from "@mux/spaces-web";
import { observer } from "mobx-react-lite";
import { useStores } from "stores";

export const Participant = observer(() => {
  const { stream } = useStores();
  
  const mediaEl = useRef(null);
  const isLocal = stream.localParticipant instanceof LocalParticipant;

  const attachTrack = useCallback((track) => {
    track.attach(mediaEl.current);
  }, []);

  const detachTrack = useCallback((track) => {
    track.detach(mediaEl.current);
  }, []);

  useEffect(() => {
    if (!mediaEl.current) return null;

    const microphoneTrack = stream.localParticipant?.getAudioTracks()
      .find((audioTrack) => audioTrack.source === TrackSource.Microphone);

    const cameraTrack = stream.localParticipant?.getVideoTracks()
      .find((videoTrack) => videoTrack.source === TrackSource.Camera);

    if (microphoneTrack) {
      attachTrack(microphoneTrack);
    }

    if (cameraTrack) {
      attachTrack(cameraTrack);
    }

    stream.localParticipant?.on(ParticipantEvent.TrackSubscribed, attachTrack);
    stream.localParticipant?.on(ParticipantEvent.TrackUnsubscribed, detachTrack);

    return () => {
      stream.localParticipant?.off(ParticipantEvent.TrackSubscribed, attachTrack);
      stream.localParticipant?.off(ParticipantEvent.TrackUnsubscribed, detachTrack);
    };
  }, [stream.localParticipant, attachTrack, detachTrack]);

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

  return (<div style={{ display: 'contents' }}>
    <video
      ref={mediaEl}
      autoPlay
      playsInline
      muted={isLocal}
      controls
      style={{ height: "100%", background: 'black' }}
    />
  </div>);
});