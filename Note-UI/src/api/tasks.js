import apiClient from './apiClient';

export const fetchTasks = async (completed) => (await apiClient.get('/tasks', { params: completed === undefined ? {} : { completed } })).data;
export const createTask = async (task) => (await apiClient.post('/tasks', task)).data;
export const updateTask = async (id, updates) => (await apiClient.put(`/tasks/${id}`, updates)).data;
export const deleteTask = async (id) => (await apiClient.delete(`/tasks/${id}`)).data;
