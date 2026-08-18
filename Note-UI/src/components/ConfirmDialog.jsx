import { useEffect, useRef } from 'react';

export default function ConfirmDialog({ title, message, onConfirm, onCancel }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  return (
    <div className="dialog-overlay" onClick={onCancel}>
      <div className="dialog" ref={dialogRef} onClick={(e) => e.stopPropagation()} role="alertdialog" aria-modal="true">
        <h3 className="dialog__title">{title}</h3>
        <p className="dialog__message">{message}</p>
        <div className="dialog__actions">
          <button className="dialog__btn dialog__btn--cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="dialog__btn dialog__btn--danger" onClick={onConfirm} autoFocus>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
