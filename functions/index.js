const functions = require("firebase-functions");

const Mux = require("@mux/mux-node");
const dotenv = require("dotenv");
dotenv.config();

const { Video } = new Mux(
  process.env.MUX_TOKEN_ID,
  process.env.MUX_TOKEN_SECRET,
);

exports.createLiveStream = functions.https.onCall(async (data, context) => {
  try {
    const response = await Video.LiveStreams.create({
      playback_policy: "public",
      new_asset_settings: { playback_policy: "public" },
    });

    return response;
  } catch (err) {
    console.error(
      `Unable to start the live stream ${context.auth.uid}. 
        Error ${err}`,
    );
    throw new functions.https.HttpsError(
      "aborted",
      "Could not create live stream",
    );
  }
});

exports.retrieveLiveStreams = functions.https.onCall(async (data, context) => {
  try {
    const liveStreams = await Video.LiveStreams.list();

    const responseList = liveStreams.map((liveStream) => ({
      id: liveStream.id,
      status: liveStream.status,
      playback_ids: liveStream.playback_ids,
      created_at: liveStream.created_at,
    }));

    return responseList;
  } catch (err) {
    console.error(
      `Unable to retrieve live streams. 
        Error ${err}`,
    );
    throw new functions.https.HttpsError(
      "aborted",
      "Could not retrieve live streams",
    );
  }
});

exports.retrieveLiveStream = functions.https.onCall(async (data, context) => {
  try {
    const liveStreamId = data.liveStreamId;
    const liveStream = await Video.LiveStreams.get(liveStreamId);

    return liveStream;
  } catch (err) {
    console.error(
      `Unable to retrieve live stream, id: ${data.liveStreamId}. 
        Error ${err}`,
    );
    throw new functions.https.HttpsError(
      "aborted",
      "Could not retrieve live stream",
    );
  }
});

exports.deleteLiveStream = functions.https.onCall(async (data, context) => {
  try {
    const liveStreamId = data.liveStreamId;
    const response = await Video.LiveStreams.del(liveStreamId);

    return response;
  } catch (err) {
    console.error(
      `Unable to delete live stream, id: ${data.liveStreamId}. 
      Error ${err}`,
    );
    throw new functions.https.HttpsError(
      "aborted",
      "Could not delete live stream",
    );
  }
});

exports.createSpaceWithBroadcast = functions.https.onCall(async (data, context) => {
  try {
    const space = await Video.Spaces.create({});

    const liveStream = await Video.LiveStreams.create({
      playback_policy: "public",
      new_asset_settings: { playback_policy: "public" },
    });

    const broadcast = await Video.Spaces.Broadcasts.create(space.id, {
      live_stream_id: liveStream.id,
      layout: 'active-speaker'
      // passthrough?: string;
      // resolution?: BroadcastResolution;
    });

    const spaceToken = Mux.JWT.signSpaceId(space.id);

    return {
      spaceToken,
      spaceId: space.id,
      liveStreamId: liveStream.id,
      broadcastId: broadcast.id
    };
  } catch (err) {
    console.error(
      `Unable to create space ${context.auth.uid}. Error ${err}`,
    );

    throw new functions.https.HttpsError(
      "aborted",
      "Could not create space",
    );
  }
});

exports.startBroadcast = functions.https.onCall(async (data, context) => {
  try {
    const response = await Video.Spaces.Broadcasts.start(data.spaceId, data.broadcastId);

    return response;
  } catch (err) {
    console.error(
      `Unable to start broadcast ${context.auth.uid}. Error ${err}`,
    );

    throw new functions.https.HttpsError(
      "aborted",
      "Could not start broadcast",
    );
  }
});

exports.stopBroadcast = functions.https.onCall(async (data, context) => {
  try {
    const response = await Video.Spaces.Broadcasts.stop(data.spaceId, data.broadcastId);

    return response;
  } catch (err) {
    console.error(
      `Unable to stop broadcast ${context.auth.uid}. Error ${err}`,
    );

    throw new functions.https.HttpsError(
      "aborted",
      "Could not stop broadcast",
    );
  }
});

exports.deleteSpace = functions.https.onCall(async (data, context) => {
  try {
    const response = await Video.Spaces.delete({ spaceId: data.spaceId });

    return response;
  } catch (err) {
    console.error(
      `Unable to delete space ${context.auth.uid}. Error ${err}`,
    );

    throw new functions.https.HttpsError(
      "aborted",
      "Could not delete space",
    );
  }
});

