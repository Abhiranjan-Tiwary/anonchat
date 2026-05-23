import { useEffect, useRef } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore.js";
import { useAdminStore } from "../store/adminStore.js";
import { useUiStore } from "../store/uiStore.js";
import { useToast } from "../hooks/useToast.js";
import { getSocket } from "../lib/socket.js";
import { cx, formatNumber } from "../lib/utils.js";
import "../styles/admin.css";

const navGroups = [
  {
    title: "Main",
    items: [
      { label: "Dashboard", href: "/admin/dashboard", icon: "DB", tone: "violet" },
      { label: "Users", href: "/admin/users", icon: "US", tone: "blue", badgeKey: "users" },
      { label: "Chat Rooms", href: "/admin/chat-rooms", icon: "CR", tone: "green", badgeKey: "rooms" },
    ],
  },
  {
    title: "Moderation",
    items: [
      { label: "Reports", href: "/admin/reports", icon: "RP", tone: "red", badgeKey: "reports" },
      { label: "Blocked Users", href: "/admin/blocked-users", icon: "BU", tone: "amber", badgeKey: "blocked" },
      { label: "Msg Monitoring", href: "/admin/messages-monitoring", icon: "MM", tone: "purple", badgeKey: "messages" },
    ],
  },
  {
    title: "Platform",
    items: [
      { label: "Announcements", href: "/admin/announcements", icon: "AN", tone: "gold", badgeKey: "announcements" },
      { label: "Settings", href: "/admin/settings", icon: "ST", tone: "gray" },
    ],
  },
];

const pageTitles = {
  "/admin/dashboard": "Dashboard",
  "/admin/users": "Users",
  "/admin/chat-rooms": "Chat Rooms",
  "/admin/reports": "Reports",
  "/admin/blocked-users": "Blocked Users",
  "/admin/messages-monitoring": "Messages Monitoring",
  "/admin/announcements": "Announcements",
  "/admin/settings": "Settings",
};

export default function AdminLayout() {
  const { user, token, logout } = useAuthStore();
  const { loading, load, users, rooms, reports, messages, announcements, stats } = useAdminStore();
  const { adminSidebarOpen, toggleAdminSidebar, setAdminSidebarOpen } = useUiStore();
  const refreshTimerRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const title = pageTitles[location.pathname] || "Dashboard";
  const openReports = reports.filter((report) => report.status === "open").length;
  const blockedUsers = users.filter((item) => item.status === "suspended").length;
  const navCounts = {
    users: users.length || stats.users || 0,
    rooms: rooms.length,
    reports: openReports,
    blocked: blockedUsers,
    messages: messages.length,
    announcements: announcements.length,
  };

  useEffect(() => {
    load(token).catch((error) => toast(error.message, "danger"));
  }, [load, toast, token]);

  useEffect(() => {
    if (!token) return undefined;
    const socket = getSocket(token);

    function scheduleRefresh() {
      window.clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = window.setTimeout(() => {
        load(token).catch((error) => toast(error.message, "danger"));
      }, 150);
    }

    const events = ["state", "rooms:update", "message:new", "message:update", "message:delete", "announcement:new", "announcement:update", "announcement:delete"];
    events.forEach((eventName) => {
      socket.off(eventName, scheduleRefresh);
      socket.on(eventName, scheduleRefresh);
    });

    if (!socket.connected) socket.connect();
    socket.emit("presence:online", { token });

    return () => {
      window.clearTimeout(refreshTimerRef.current);
      events.forEach((eventName) => socket.off(eventName, scheduleRefresh));
    };
  }, [load, toast, token]);

  async function handleLogout() {
    await logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className={cx("adm", adminSidebarOpen && "sidebar-open")}>
      <aside className="adm-sb">
        <div className="adm-sb-logo">
          <img className="adm-logo-icon" src="/assets/logo/logo.png" alt="AnonChat logo" />
          <span className="adm-logo-text">AnonChat</span>
          <span className="adm-logo-badge">ADMIN</span>
        </div>

        <nav className="adm-nav" aria-label="Admin navigation">
          {navGroups.map((group) => (
            <div key={group.title}>
              <div className="adm-sb-section">{group.title}</div>
              {group.items.map((item) => {
                const badge = item.badgeKey ? Number(navCounts[item.badgeKey] || 0) : 0;

                return (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    onClick={() => setAdminSidebarOpen(false)}
                    className={({ isActive }) => cx("adm-nav-item", isActive && "active")}
                  >
                    <span className={`adm-nav-icon ${item.tone}`}>{item.icon}</span>
                    {item.label}
                    {badge > 0 ? <span className="adm-nav-badge">{formatNumber(badge)}</span> : null}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="adm-sb-footer">
          <div className="adm-user-av">{adminInitials(user)}</div>
          <div>
            <div className="adm-user-name">{user?.name || "Super Admin"}</div>
            <div className="adm-user-role">@{user?.username || "admin"} - {user?.role || "admin"}</div>
          </div>
          <button className="adm-logout-btn" type="button" onClick={handleLogout} aria-label="Logout">↩</button>
        </div>
      </aside>

      <main className="adm-main">
        <header className="adm-topbar">
          <button className="adm-menu-btn" type="button" onClick={toggleAdminSidebar} aria-label="Toggle sidebar">
            <span /><span /><span />
          </button>
          <div className="adm-breadcrumb">Admin / <span>{title}</span></div>
          <div className="adm-topbar-search">
            <span>⌕</span>
            <input placeholder="Search users, rooms, reports..." />
          </div>
          <div className="adm-topbar-actions">
            <div className="adm-live-pill"><div className="adm-live-dot" /> {loading ? "Syncing" : "Live"}</div>
            <button className="adm-icon-btn" type="button" aria-label="Notifications">!
              {openReports ? <div className="dot" /> : null}
            </button>
            <button className="adm-icon-btn" type="button" aria-label="Settings" onClick={() => navigate("/admin/settings")}>ST</button>
          </div>
        </header>

        <section className="adm-page">
          <Outlet />
        </section>
      </main>
    </div>
  );
}

function adminInitials(user) {
  const source = user?.name || user?.username || "Admin";
  const words = String(source).split(/\s+/).filter(Boolean);
  return words.length > 1 ? `${words[0][0]}${words[1][0]}`.toUpperCase() : source.slice(0, 2).toUpperCase();
}
