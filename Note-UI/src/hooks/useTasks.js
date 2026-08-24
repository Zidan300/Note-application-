import { useState, useCallback, useEffect } from 'react';
/* eslint-disable react-hooks/set-state-in-effect */
import * as tasksApi from '../api/tasks';
const messageFor = (error, fallback) => error.response?.data?.message || (error.request ? 'Unable to reach the server' : fallback);
export function useTasks() {
  const [tasks, setTasks] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState(null); const [operation, setOperation] = useState(null); const [filter, setFilter] = useState('all'); const [selectedId, setSelectedId] = useState(null);
  const load = useCallback(async () => { setLoading(true); setError(null); try { const res = await tasksApi.fetchTasks(filter === 'all' ? undefined : filter === 'completed'); setTasks(Array.isArray(res.data) ? res.data : []); } catch (err) { setError(messageFor(err, 'Failed to load tasks')); } finally { setLoading(false); } }, [filter]);
  useEffect(() => { load(); }, [load]);
  const run = useCallback(async (name, action) => { setOperation(name); setError(null); try { return await action(); } catch (err) { setError(messageFor(err, `Unable to ${name} task`)); throw err; } finally { setOperation(null); } }, []);
  const addTask = useCallback((data) => run('create', async () => { const res = await tasksApi.createTask(data); setTasks((prev) => [res.data, ...prev]); return res.data; }), [run]);
  const editTask = useCallback((id, data) => run('update', async () => { const res = await tasksApi.updateTask(id, data); setTasks((prev) => prev.map((t) => t._id === id ? res.data : t)); return res.data; }), [run]);
  const removeTask = useCallback((id) => run('delete', async () => { await tasksApi.deleteTask(id); setTasks((prev) => prev.filter((t) => t._id !== id)); setSelectedId((prev) => prev === id ? null : prev); }), [run]);
  const toggleComplete = useCallback((id) => run('complete', async () => { const task = tasks.find((t) => t._id === id); if (!task) return; const res = await tasksApi.updateTask(id, { isCompleted: !task.isCompleted }); setTasks((prev) => prev.map((t) => t._id === id ? res.data : t)); return res.data; }), [run, tasks]);
  return { tasks, loading, error, operation, filter, setFilter, selectedId, setSelectedId, selectedTask: tasks.find((t) => t._id === selectedId) || null, addTask, editTask, removeTask, toggleComplete, refresh: load };
}
