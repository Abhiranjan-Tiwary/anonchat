import Button from "./Button.jsx";

export default function Modal({ open, title, children, confirmLabel = "Save", onClose, onConfirm, loading }) {
  if (!open) return null;

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={title} onMouseDown={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close">x</button>
        </div>
        <div className="modal-body">{children}</div>
        <div className="modal-actions">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button loading={loading} onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      </div>
    </div>
  );
}
