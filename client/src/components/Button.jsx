import { cx } from "../lib/utils.js";

export default function Button({ children, variant = "primary", size = "md", loading = false, className = "", ...props }) {
  return (
    <button
      className={cx("btn", `btn-${variant}`, `btn-${size}`, loading && "is-loading", className)}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? <span className="spinner" aria-hidden="true" /> : null}
      <span>{children}</span>
    </button>
  );
}
