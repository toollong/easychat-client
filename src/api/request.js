import axios from "axios";
import nprogress from "nprogress";

import "nprogress/nprogress.css";

const requests = axios.create({
    baseURL: '/api',
    timeout: 30000
})

requests.interceptors.request.use((config) => {
    if (config.url.includes("/auth/")
        || config.url.includes("/register")
        || config.url.includes("/verifyCode/")
        || config.url.includes("/validate")
        || config.url.includes("/changePassword")) {
        return config;
    }
    nprogress.start();
    return config;
}, (error) => {
    return Promise.reject(error);
})

requests.interceptors.response.use((response) => {
    if (response.status === 200) {
        nprogress.done();
        return response.data;
    }
    nprogress.done();
}, (error) => {
    return Promise.reject(error);
})

export default requests;