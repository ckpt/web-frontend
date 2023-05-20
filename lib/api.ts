// api.js
import Axios from "axios";

let urls = {
    test: 'https://api.ckpt.no/',
    development: 'https://api.ckpt.no/',
    production: 'https://api.ckpt.no/',
}
const api = Axios.create({
    baseURL: urls[process.env.NODE_ENV],
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

const devApi = Axios.create({
    baseURL: 'http://localhost:5000',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

export const fetcher = (url: string) => api.get(url).then(res => res.data);
export const putter = (url: string, { arg }: {arg: object}) => devApi.put(url, arg).then(res => res.data);
export const poster = (url: string, arg: any) => devApi.post(url, arg).then(res => res.data);
export default api;