import axios from "./request";
import mockAxios from "./mockAxios";

export const mockGetUserInfo = () => mockAxios.get('/user');
export const mockGetChatList = () => mockAxios.get('/chats');
export const mockGetFriendList = () => mockAxios.get('/friends');
export const mockGetFriendVerify = () => mockAxios.get('/friends/verify');
export const mockGetHistory = () => mockAxios.get('/chats/chat/history');


export const reqLogin = (data) => axios.post('/auth/login', data);

export const reqRegister = (data) => axios.post('/user/register', data);

export const reqSendCode = (data) => axios.post('/user/verifyCode/send', data);

export const reqValidateCode = (data) => axios.post('/user/verifyCode/validate', data);

export const reqValidateUsername = (data) => axios.post('/user/username/validate', data);

export const reqValidatePassword = (data) => axios.post('/user/password/validate', data);

export const reqSearchUsers = (params) => axios.get('/user/search', { params: params });

export const reqGetUserInfo = (params) => axios.get('/user/user', { params: params });

export const reqEditUserInfo = (data) => axios.post('/user/user/edit', data);

export const reqChangeAvatar = (data) => axios.post('/user/user/changeAvatar', data, { headers: { 'Content-Type': 'multipart/form-data' } });

export const reqChangePassword = (data) => axios.post('/user/user/changePassword', data);

export const reqGetChatList = (params) => axios.get('/chat/chats', { params: params });

export const reqGetFriendList = (params) => axios.get('/user/friends', { params: params });

export const reqGetFriendVerify = (params) => axios.get('/user/friendVerify', { params: params });

export const reqGetHistory = (params) => axios.get('/chat/chats/chatHistory', { params: params });

export const reqSavePictureMsg = (data) => axios.post('/chat/chats/savePictureMsg', data, { headers: { 'Content-Type': 'multipart/form-data' } });

export const reqLogout = () => axios.post('/auth/logout');