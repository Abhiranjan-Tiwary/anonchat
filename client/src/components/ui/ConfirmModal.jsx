import Modal from "./Modal.jsx";

export default function ConfirmModal({ open, title, message, confirmLabel = "Confirm", loading, danger = false, onClose, onConfirm, children }) {
  return (
    <Modal open={open} title={title} confirmLabel={confirmLabel} loading={loading} onClose={onClose} onConfirm={onConfirm}>
      <div className="form-stack">
        {message ? <p className={danger ? "modal-copy danger" : "modal-copy"}>{message}</p> : null}
        {children}
      </div>
    </Modal>
  );
}
