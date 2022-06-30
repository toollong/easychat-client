import axios from "./request";
import mockAxios from "./mockAxios";

export const mockGetUserInfo = () => mockAxios.get('/user');
export const mockGetChatList = () => mockAxios.get('/chats');
export const mockGetFriendList = () => mockAxios.get('/friends');
export const mockGetFriendVerify = () => mockAxios.get('/friends/verify');
export const mockGetHistory = () => mockAxios.get('/chats/chat/history');


export const reqLogin = (data) => axios.post('/login', data);

export const reqRegister = (data) => axios.post('/register', data);

export const reqGetUserInfo = (userId) => axios.get('/user', { params: userId });

export const reqEditUserInfo = (data) => axios.post('/user/edit', data);

export const reqChangePassword = (data) => axios.post('/user/changePwd', data);

export const reqGetChatList = (userId) => axios.get('/chats', { params: userId });

export const reqGetFriendList = (userId) => axios.get('/friends', { params: userId });

export const reqGetHistory = (params) => axios.get('/chats/chat/history', { params: params });

export const reqLogout = () => axios.post('/logout');