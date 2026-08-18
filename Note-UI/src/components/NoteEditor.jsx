import { useState, useRef, useEffect } from 'react';

export default function NoteEditor({ task, onSave, onBack, onDelete, onToggleComplete }) {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [isCompleted, setIsCompleted] = useState(task?.isCompleted || false);
  const [dueDate, setDueDate] = useState(task?.dueDate ? task.dueDate.split('T')[0] : '');
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const titleRef = useRef(null);
  const autoSaveTimer = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => titleRef.current?.focus(), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    return () => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    };
  }, []);

  const save = async () => {
    if (!task) return;
    if (!title.trim()) return;
    setSaving(true);
    try {
      await onSave(task._id, {
        title: title.trim(),
        description: description.trim(),
        isCompleted,
        dueDate: dueDate || null,
      });
      setDirty(false);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        if (dirty) save();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  });

  const scheduleAutoSave = () => {
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(save, 800);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    setDirty(true);
  };

  const handleDescChange = (e) => {
    setDescription(e.target.value);
    setDirty(true);
  };

  const handleDateChange = (e) => {
    setDueDate(e.target.value);
    setDirty(true);
    scheduleAutoSave();
  };

  const handleToggleComplete = async () => {
    const newVal = !isCompleted;
    setIsCompleted(newVal);
    await onToggleComplete(task._id);
  };

  if (!task) {
    return (
      <div className="editor editor--empty">
        <div className="editor__placeholder">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          <p>Select a note to start editing</p>
        </div>
      </div>
    );
  }

  return (
    <div className="editor">
      <div className="editor__toolbar">
        <button className="editor__back" onClick={onBack} aria-label="Back to notes">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="editor__toolbar-actions">
          <button
            className={`editor__btn ${isCompleted ? 'editor__btn--active' : ''}`}
            onClick={handleToggleComplete}
            title={isCompleted ? 'Mark as active' : 'Mark as completed'}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>

          <button
            className="editor__btn editor__btn--danger"
            onClick={() => onDelete(task._id)}
            title="Delete note"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      <div className="editor__body">
        <input
          ref={titleRef}
          className="editor__title"
          type="text"
          placeholder="Note title"
          value={title}
          onChange={handleTitleChange}
          onBlur={() => dirty && save()}
          maxLength={100}
        />

        <div className="editor__date-row">
          <div className="editor__date-field">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
            <input
              type="date"
              className="editor__date-input"
              value={dueDate}
              onChange={handleDateChange}
            />
            {!dueDate && <span className="editor__date-label">Set due date</span>}
          </div>
          {dirty && (
            <span className="editor__save-status">
              {saving ? 'Saving...' : 'Unsaved'}
            </span>
          )}
          {!dirty && task.updatedAt && (
            <span className="editor__save-status">
              Saved
            </span>
          )}
        </div>

        <textarea
          className="editor__content"
          placeholder="Start writing..."
          value={description}
          onChange={handleDescChange}
          onBlur={() => dirty && save()}
        />
      </div>
    </div>
  );
}
