import axios from 'axios';

export const login = async (username: string, password: string) => {
  return axios.post('/api/login', { username, password });
};

export const register = async (username: string, password: string, phone: string, smsCode: string) => {
  return axios.post('/api/register', { username, password, phone, smsCode });
};

export const sendSMSCode = async (phone: string, type: 'login' | 'register') => {
  return axios.post('/api/send_sms_code', { phone, type });
};

export const smsLogin = async (phone: string, smsCode: string) => {
  return axios.post('/api/sms_login', { phone, smsCode });
};

// AI助手相关API
export const chatWithAI = async (message: string, chatId?: string, history?: Array<{role: string, content: string}>) => {
  return axios.post('/api/ai/chat', { message, chatId, history });
};

export const summarizeMessages = async (chatId: string) => {
  return axios.post('/api/ai/summarize', { chatId });
};

// 文件相关API
export const uploadFile = async (file: File, chatId: string) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('chatId', chatId);
  
  return axios.post('/api/files/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const getFileDownloadUrl = async (fileId: string) => {
  return axios.get(`/api/files/download/${fileId}`);
};

export const getMessageHistory = async (chatId: string, page: number = 1, limit: number = 20) => {
  return axios.get(`/api/messages/${chatId}`, {
    params: { page, limit }
  });
};

export const searchMessages = async (chatId: string, query: string) => {
  return axios.get(`/api/messages/search`, {
    params: { chatId, query }
  });
}; 