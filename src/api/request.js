import axios from "axios";
import nprogress from "nprogress";

import "nprogress/nprogress.css";

const requests = axios.create({
    baseURL: '/api',
    timeout: 5000
})

requests.interceptors.request.use((config) => {
    nprogress.start();
    return config;
}, (error) => {
    return Promise.reject(new Error("网络异常！"));
})

requests.interceptors.response.use((response) => {
    nprogress.done();
    return response.data;
}, (error) => {
    return Promise.reject(new Error("网络异常！"));
})

export default requests;