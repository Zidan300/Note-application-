import axios from 'axios';

const API_BASE = 'http://localhost:3000/api/tasks';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

export const fetchTasks = async (completed) => {
  const params = completed !== undefined ? { completed } : {};
  const { data } = await api.get('/', { params });
  return data;
};

export const fetchTaskById = async (id) => {
  const { data } = await api.get(`/${id}`);
  return data;
};

export const createTask = async (task) => {
  const { data } = await api.post('/', task);
  return data;
};

export const updateTask = async (id, updates) => {
  const { data } = await api.put(`/${id}`, updates);
  return data;
};

export const deleteTask = async (id) => {
  await api.delete(`/${id}`);
};
