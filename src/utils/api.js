import axios from 'axios';

const backendUrl = "https://1country-live-stream.fly.dev";

export const getLiveStreams = async () => {
    return axios.get(`${backendUrl}/streams/list`);
};

export const getLiveStream = async (id) => {
    return axios.get(`${backendUrl}/streams/${id}`);
};

export const getLiveStreamToken = async (id) => {
    return axios.get(`${backendUrl}/streams/${id}/token`);
};

export const createLiveStream = async (params) => {
    return axios.post(`${backendUrl}/streams/create`, params);
};

export const deleteLiveStream = async (id) => {
    return axios.post(`${backendUrl}/streams/${id}/delete`);
};

export const startLiveStream = async (id) => {
    return axios.post(`${backendUrl}/streams/${id}/start`);
};