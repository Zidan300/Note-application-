export default function EmptyState({ type }) {
  if (type === 'error') {
    return (
      <div className="empty-state">
        <div className="empty-state__icon empty-state__icon--error">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v4m0 4h.01" />
          </svg>
        </div>
        <h3 className="empty-state__title">Something went wrong</h3>
        <p className="empty-state__text">Unable to connect to the server. Please try again.</p>
      </div>
    );
  }

  if (type === 'search') {
    return (
      <div className="empty-state">
        <div className="empty-state__icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
        </div>
        <h3 className="empty-state__title">No results found</h3>
        <p className="empty-state__text">Try a different search term.</p>
      </div>
    );
  }

  return (
    <div className="empty-state">
      <div className="empty-state__icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 className="empty-state__title">No notes yet</h3>
      <p className="empty-state__text">Create your first note to get started.</p>
    </div>
  );
}
