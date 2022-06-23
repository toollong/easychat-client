import axios from "./request";
import mockAxios from "./mockAxios";

export const mockGetUserInfo = () => mockAxios.get('/user');
export const mockGetChatList = () => mockAxios.get('/chats');
export const mockGetFriendList = () => mockAxios.get('/friends');
export const mockGetFriendVerify = () => mockAxios.get('/friends/verify');
export const mockGetHistory = () => mockAxios.get('/chats/chat/history');
export const mockAddChat = () => mockAxios.post('/chats/add');
export const mockLogout = () => mockAxios.post('/logout');


export const reqLogin = (data) => axios.post('/login', data);

export const reqRegister = (data) => axios.post('/register', data);

// menu
export const reqGetUserAvatar = (userId) => axios.get('/user/avatar', { params: userId });

export const reqGetUserInfo = (userId) => axios.get('/user', { params: userId });

export const reqEditUserInfo = (data) => axios.post('/user/edit', data);

export const reqChangePassword = (data) => axios.post('/user/changePwd', data);

export const reqLogout = () => axios.post('/logout');

// chats
export const reqGetChatList = (userId) => axios.get('/chats', { params: userId });

export const reqAddGroup = (data) => axios.post('/group/add', data);

export const reqRemoveChat = (data) => axios.post('/chat/remove', data);

// friends
export const reqGetFriendList = (userId) => axios.get('/friends', { params: userId });

export const reqAddFriend = (data) => axios.post('/friend/add', data);

export const reqRemoveFriend = (data) => axios.post('/friend/remove', data);

export const reqAddChat = (data) => axios.post('/chats/add', data);

// chat
export const reqGetHistory = (params) => axios.get('/chats/chat/history', { params: params });

export const reqAddHistory = (data) => axios.post('/chats/chat/history/add', data);