import { useState, useCallback, useEffect } from 'react';
import * as tasksApi from '../api/tasks';

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [selectedId, setSelectedId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const completed = filter === 'all' ? undefined : filter === 'completed';

    tasksApi.fetchTasks(completed).then((res) => {
      if (!cancelled) {
        setTasks(res.data || []);
        setLoading(false);
        setError(null);
      }
    }).catch((err) => {
      if (!cancelled) {
        setError(err.response?.data?.message || 'Failed to load tasks');
        setLoading(false);
      }
    });

    return () => { cancelled = true; };
  }, [filter, refreshKey]);

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  const addTask = useCallback(async (taskData) => {
    const res = await tasksApi.createTask(taskData);
    setTasks((prev) => [res.data, ...prev]);
    return res.data;
  }, []);

  const editTask = useCallback(async (id, updates) => {
    const res = await tasksApi.updateTask(id, updates);
    setTasks((prev) => prev.map((t) => (t._id === id ? res.data : t)));
    return res.data;
  }, []);

  const removeTask = useCallback(async (id) => {
    await tasksApi.deleteTask(id);
    setTasks((prev) => prev.filter((t) => t._id !== id));
    setSelectedId((prev) => (prev === id ? null : prev));
  }, []);

  const toggleComplete = useCallback(async (id) => {
    const task = tasks.find((t) => t._id === id);
    if (!task) return;
    const res = await tasksApi.updateTask(id, { isCompleted: !task.isCompleted });
    setTasks((prev) => prev.map((t) => (t._id === id ? res.data : t)));
  }, [tasks]);

  const selectedTask = tasks.find((t) => t._id === selectedId) || null;

  return {
    tasks,
    loading,
    error,
    filter,
    setFilter,
    selectedId,
    setSelectedId,
    selectedTask,
    addTask,
    editTask,
    removeTask,
    toggleComplete,
    refresh,
  };
}
