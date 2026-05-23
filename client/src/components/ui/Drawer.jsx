import { cx } from "../../lib/utils.js";

export default function Drawer({ open, title, children, onClose, footer, className = "" }) {
  if (!open) return null;

  return (
    <div className="drawer-backdrop" role="presentation" onMouseDown={onClose}>
      <aside className={cx("drawer", className)} role="dialog" aria-modal="true" aria-label={title} onMouseDown={(event) => event.stopPropagation()}>
        <header className="drawer-header">
          <div>
            <p className="eyebrow">Details</p>
            <h2>{title}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close drawer">x</button>
        </header>
        <div className="drawer-body">{children}</div>
        {footer ? <footer className="drawer-footer">{footer}</footer> : null}
      </aside>
    </div>
  );
}
