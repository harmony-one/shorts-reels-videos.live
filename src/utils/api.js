import axios from 'axios';

const backendUrl = "https://1country-live-stream.fly.dev";
// const backendUrl = "http://localhost:8080";

export const getLiveStreams = async () => {
    return axios.get(`${backendUrl}/streams/list`);
};

export const getLiveStream = async (id, address) => {
    return axios.get(`${backendUrl}/streams/${id}?address=${address}`);
};

export const getLiveStreamToken = async (id) => {
    return axios.get(`${backendUrl}/streams/${id}/token`);
};

export const createLiveStream = async (params) => {
    return axios.post(`${backendUrl}/streams/create`, params);
};

export const getPaymentLink = async (id, address) => {
    return axios.post(`${backendUrl}/streams/${id}/pay`, { address });
};

export const deleteLiveStream = async (id) => {
    return axios.post(`${backendUrl}/streams/${id}/delete`);
};

export const startLiveStream = async (id) => {
    return axios.post(`${backendUrl}/streams/${id}/start`);
};