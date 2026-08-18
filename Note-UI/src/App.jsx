import { useState, useCallback } from 'react';
import { useTasks } from './hooks/useTasks';
import Sidebar from './components/Sidebar';
import NoteList from './components/NoteList';
import NoteEditor from './components/NoteEditor';
import SearchBar from './components/SearchBar';
import ConfirmDialog from './components/ConfirmDialog';
import './App.css';

function App() {
  const {
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
  } = useTasks();

  const [search, setSearch] = useState('');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [mobileEditorOpen, setMobileEditorOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const filteredTasks = tasks.filter((t) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (t.title && t.title.toLowerCase().includes(q)) ||
      (t.description && t.description.toLowerCase().includes(q))
    );
  });

  const handleSelect = useCallback((id) => {
    setSelectedId(id);
    setMobileEditorOpen(true);
  }, [setSelectedId]);

  const handleBack = useCallback(() => {
    setMobileEditorOpen(false);
    setTimeout(() => setSelectedId(null), 300);
  }, [setSelectedId]);

  const handleNewNote = async () => {
    try {
      const newTask = await addTask({
        title: 'New Note',
        description: '',
        isCompleted: false,
      });
      setSelectedId(newTask._id);
      setMobileEditorOpen(true);
    } catch {
      /* error handled in hook */
    }
  };

  const handleDelete = (id) => {
    const task = tasks.find((t) => t._id === id);
    setConfirmDelete(task || { _id: id });
  };

  const confirmDeleteAction = async () => {
    if (!confirmDelete) return;
    try {
      await removeTask(confirmDelete._id);
      setConfirmDelete(null);
      setMobileEditorOpen(false);
    } catch {
      /* error handled in hook */
    }
  };

  const getEmptyType = () => {
    if (error) return 'error';
    if (search && filteredTasks.length === 0) return 'search';
    if (!loading && tasks.length === 0) return 'empty';
    return null;
  };

  const countLabel = filteredTasks.length === 1 ? '1 note' : `${filteredTasks.length} notes`;

  return (
    <div className="app">
      <Sidebar
        filter={filter}
        onFilterChange={setFilter}
        taskCount={tasks.length}
        mobileOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      <main className={`note-panel ${mobileEditorOpen && selectedTask ? 'note-panel--editor-open' : ''}`}>
        <div className="note-panel__list">
          <div className="note-panel__topbar">
            <button className="note-panel__menu" onClick={() => setMobileSidebarOpen(true)} aria-label="Open sidebar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="note-panel__heading">
              {filter === 'all' ? 'All Notes' : filter === 'active' ? 'Active' : 'Completed'}
            </h1>
            <button className="note-panel__add" onClick={handleNewNote} aria-label="New note">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14m-7-7h14" />
              </svg>
            </button>
          </div>

          <div className="note-panel__search">
            <SearchBar value={search} onChange={setSearch} />
          </div>

          {!loading && !error && tasks.length > 0 && (
            <div className="note-panel__count">{countLabel}</div>
          )}

          {loading ? (
            <div className="note-panel__loading">
              <div className="spinner" />
            </div>
          ) : (
            <NoteList
              tasks={filteredTasks}
              selectedId={selectedId}
              onSelect={handleSelect}
              emptyType={getEmptyType()}
              listHeader={null}
            />
          )}
        </div>

        <div className="note-panel__editor">
          <NoteEditor
            key={selectedTask?._id || '__none__'}
            task={selectedTask}
            onSave={editTask}
            onBack={handleBack}
            onDelete={handleDelete}
            onToggleComplete={toggleComplete}
          />
        </div>
      </main>

      {confirmDelete && (
        <ConfirmDialog
          title="Delete Note"
          message={`Are you sure you want to delete "${confirmDelete.title || 'this note'}"? This cannot be undone.`}
          onConfirm={confirmDeleteAction}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}

export default App;
