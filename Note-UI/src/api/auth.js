import apiClient from './apiClient';

export const login = async (credentials) => (await apiClient.post('/auth/login', credentials)).data;
export const signup = async (details) => (await apiClient.post('/auth/signup', details)).data;
