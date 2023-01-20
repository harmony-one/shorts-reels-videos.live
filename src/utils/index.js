import { initializeApp } from 'firebase/app';
import { getFunctions, httpsCallable } from 'firebase/functions';

export * from './api';

// const app = initializeApp({
//     projectId: 'test-5029b',
//     apiKey: 'AIzaSyAeb1CBhvnXvqyvaO_Oza3N1ZQExJtaM3w',
//     authDomain: 'https://accounts.google.com/o/oauth2/auth',
// });

// const functions = getFunctions(app);

// export const retrieveLiveStreams = httpsCallable(functions, 'retrieveLiveStreams');
// export const retrieveLiveStream = httpsCallable(functions, 'retrieveLiveStream');
// export const createLiveStream = httpsCallable(functions, 'createLiveStream');
// export const deleteLiveStream = httpsCallable(functions, 'deleteLiveStream');

// export const createSpaceWithBroadcast = httpsCallable(functions, 'createSpaceWithBroadcast');
// export const deleteSpace = httpsCallable(functions, 'deleteSpace');
// export const startBroadcast = httpsCallable(functions, 'startBroadcast');
// export const stopBroadcast = httpsCallable(functions, 'stopBroadcast');