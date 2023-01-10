import { initializeApp } from 'firebase/app';
import { getFunctions, httpsCallable } from 'firebase/functions';

const app = initializeApp({
    projectId: 'test-5029b',
    apiKey: 'AIzaSyAeb1CBhvnXvqyvaO_Oza3N1ZQExJtaM3w',
    authDomain: 'https://accounts.google.com/o/oauth2/auth',
});

const functions = getFunctions(app);

export const retrieveLiveStreams = httpsCallable(functions, 'retrieveLiveStreams');
export const retrieveLiveStream = httpsCallable(functions, 'retrieveLiveStream');
export const createLiveStream = httpsCallable(functions, 'createLiveStream');
export const deleteLiveStream = httpsCallable(functions, 'deleteLiveStream');