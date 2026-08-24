const filters = [
  { key: 'all', label: 'All Notes' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Completed' },
];

export default function Sidebar({ filter, onFilterChange, taskCount, mobileOpen, onClose, onLogout }) {
  return (
    <>
      {mobileOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${mobileOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar__header">
          <div className="sidebar__brand">
            <svg className="sidebar__logo" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="sidebar__title">Notes</span>
          </div>
          <button className="sidebar__close" onClick={onClose} aria-label="Close sidebar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="sidebar__nav">
          {filters.map((f) => (
            <button
              key={f.key}
              className={`sidebar__item ${filter === f.key ? 'sidebar__item--active' : ''}`}
              onClick={() => {
                onFilterChange(f.key);
                onClose?.();
              }}
            >
              <span className="sidebar__item-icon">
                {f.key === 'all' && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
                {f.key === 'active' && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="9" />
                  </svg>
                )}
                {f.key === 'completed' && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </span>
              <span className="sidebar__item-label">{f.label}</span>
              {filter === f.key && <span className="sidebar__item-count">{taskCount}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar__footer">
          <button className="sidebar__logout" onClick={onLogout}>Log out</button>
          <div className="sidebar__version">Note App</div>
        </div>
      </aside>
    </>
  );
}
