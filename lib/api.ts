// api.js
import Axios from "axios";

let urls = {
    test: 'https://api.ckpt.no/',
    development: 'http://localhost:8000/',
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
    baseURL: 'http://localhost:8000',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

export const fetcher = (url: string) => api.get(url).then(res => res.data);
export const putter = (url: string, { arg }: {arg: object}) => api.put(url, arg).then(res => res.data);
export const poster = (url: string, { arg }: {arg: object}) => api.post(url, arg).then(res => res.data);
export const deleter = (url: string, arg: any) => api.delete(url, arg).then(res => res.data);
export const entityDeleter = (url: string, { arg }: {arg: object}) => {
    const a = arg as { entity: string };
    api.delete(url.replaceAll(":entity:", a.entity)).then(res => res.data);
};
export default api;