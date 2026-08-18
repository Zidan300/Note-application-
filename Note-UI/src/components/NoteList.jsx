import EmptyState from './EmptyState';

function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now - date;
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  if (hrs < 24) return `${hrs}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function NoteList({ tasks, selectedId, onSelect, emptyType, listHeader }) {
  if (emptyType) {
    return (
      <div className="note-list">
        <div className="note-list__empty">
          <EmptyState type={emptyType} />
        </div>
      </div>
    );
  }

  return (
    <div className="note-list">
      {listHeader && <div className="note-list__header">{listHeader}</div>}
      <div className="note-list__items">
        {tasks.map((task) => (
          <button
            key={task._id}
            className={`note-card ${selectedId === task._id ? 'note-card--selected' : ''} ${task.isCompleted ? 'note-card--completed' : ''}`}
            onClick={() => onSelect(task._id)}
          >
            <div className="note-card__top">
              <h4 className="note-card__title">{task.title || 'Untitled'}</h4>
              <span className="note-card__time">{formatDate(task.updatedAt || task.createdAt)}</span>
            </div>
            {task.description && (
              <p className="note-card__preview">
                {task.description.length > 100 ? task.description.slice(0, 100) + '...' : task.description}
              </p>
            )}
            <div className="note-card__meta">
              {task.isCompleted && <span className="note-card__badge note-card__badge--done">Done</span>}
              {task.dueDate && (
                <span className="note-card__badge note-card__badge--due">
                  Due {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
