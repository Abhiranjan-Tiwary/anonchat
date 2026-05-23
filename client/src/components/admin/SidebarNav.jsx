import { NavLink } from "react-router-dom";
import { cx } from "../../lib/utils.js";

export default function SidebarNav({ items, onNavigate }) {
  return (
    <nav className="admin-shell-nav" aria-label="Admin navigation">
      {items.map(([label, href, icon]) => (
        <NavLink
          key={href}
          to={href}
          onClick={onNavigate}
          className={({ isActive }) => cx("admin-shell-link", isActive && "active")}
        >
          <span>{icon}</span>
          <strong>{label}</strong>
        </NavLink>
      ))}
    </nav>
  );
}
