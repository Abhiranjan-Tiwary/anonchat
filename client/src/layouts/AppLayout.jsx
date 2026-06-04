import { useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import Button from "../components/Button.jsx";
import Avatar from "../components/Avatar.jsx";
import { useToast } from "../hooks/useToast.js";
import { api } from "../lib/api.js";
import { getSocket } from "../lib/socket.js";
import { useAuthStore } from "../store/authStore.js";
import { useNotificationStore } from "../store/notificationStore.js";
import "../styles/user-dashboard.css";

const navItems = [
  { to: "/dashboard", label: "Home", icon: "⌂", end: true },
  { to: "/dashboard/search", label: "Search", icon: "⌕" },
  { to: "/dashboard/explore", label: "Explore", icon: "◇" },
  { to: "/dashboard/reels", label: "Reels", icon: "▶" },
  { to: "/dashboard/messages", label: "Messages", icon: "✉" },
  { to: "/dashboard/notifications", label: "Notifications", icon: "♡", hasBadge: true },
  { to: "/dashboard/create", label: "Create", icon: "+" },
  { to: "/dashboard/profile", label: "Profile", icon: "◉" },
];

export default function AppLayout() {
  const { user, token, logout } = useAuthStore();
  const loadBlockedUsers = useAuthStore((state) => state.loadBlockedUsers);
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  const syncAnnouncements = useNotificationStore((state) => state.syncAnnouncements);
  const addAnnouncement = useNotificationStore((state) => state.addAnnouncement);
  const updateAnnouncement = useNotificationStore((state) => state.updateAnnouncement);
  const deleteAnnouncement = useNotificationStore((state) => state.deleteAnnouncement);
  const visibleUnreadCount = user?.isGuest ? 0 : unreadCount;
  const { toast } = useToast();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/", { replace: true });
  }

  useEffect(() => {
    if (!token || user?.isGuest) return undefined;

    let active = true;
    const socket = getSocket(token);

    async function loadAnnouncements() {
      try {
        const state = await api("/api/state", { token });
        if (active) syncAnnouncements(state.announcements || []);
      } catch {
        // Dashboard can still render if hydration fails for a moment.
      }
    }

    function handleState(payload) {
      syncAnnouncements(payload?.announcements || []);
    }

    function handleAnnouncement(announcement) {
      addAnnouncement(announcement);
      toast(`Notification: ${announcement.title || "New update"}`, "success");
    }

    function handleAnnouncementUpdate(announcement) {
      updateAnnouncement(announcement);
      toast(`Notification updated: ${announcement.title || "Update"}`, "info");
    }

    function handleAnnouncementDelete(payload) {
      deleteAnnouncement(payload?.id || payload?.announcementId);
      toast("Notification removed by admin.", "info");
    }

    loadAnnouncements();
    loadBlockedUsers().catch(() => {
      // Blocked-user hydration is not critical for the rest of the dashboard shell.
    });
    socket.off("state", handleState);
    socket.off("announcement:new", handleAnnouncement);
    socket.off("announcement:update", handleAnnouncementUpdate);
    socket.off("announcement:delete", handleAnnouncementDelete);
    socket.on("state", handleState);
    socket.on("announcement:new", handleAnnouncement);
    socket.on("announcement:update", handleAnnouncementUpdate);
    socket.on("announcement:delete", handleAnnouncementDelete);

    if (!socket.connected) socket.connect();
    socket.emit("presence:online", { token });

    return () => {
      active = false;
      socket.off("state", handleState);
      socket.off("announcement:new", handleAnnouncement);
      socket.off("announcement:update", handleAnnouncementUpdate);
      socket.off("announcement:delete", handleAnnouncementDelete);
    };
  }, [addAnnouncement, deleteAnnouncement, loadBlockedUsers, syncAnnouncements, toast, token, updateAnnouncement, user?.isGuest]);

  return (
    <div className="ig-app-shell">
      <aside className="ig-sidebar" aria-label="Primary navigation">
        <NavLink to="/dashboard" end className="ig-brand" aria-label="AnonChat home">
          <img className="ig-brand-logo" src="/assets/logo/logo.png" alt="AnonChat logo" />
          <div>
            <strong>AnonChat</strong>
            <small>Social</small>
          </div>
        </NavLink>

        <nav className="ig-nav">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => `ig-nav-link ${isActive ? "active" : ""}`}>
              <span className={`ig-nav-icon ${item.hasBadge && visibleUnreadCount ? "has-unread" : ""}`}>{item.icon}</span>
              <strong>{item.label}</strong>
              {item.hasBadge && visibleUnreadCount ? <em>{visibleUnreadCount > 99 ? "99+" : visibleUnreadCount}</em> : null}
            </NavLink>
          ))}
        </nav>

        <div className="ig-sidebar-footer">
          <NavLink to="/dashboard/profile" className="ig-profile-mini">
            <Avatar name={user?.name || user?.anonymousName || "Anonymous"} src={user?.avatarDataUrl} color={user?.avatarColor} />
            <div>
              <strong>{user?.anonymousName || user?.name || "Anonymous User"}</strong>
              {user?.isGuest ? <span>Guest mode</span> : <span>@{user?.username || "anonchat"}</span>}
            </div>
          </NavLink>
          <Button variant="ghost" className="ig-logout-btn" onClick={handleLogout}>Logout</Button>
        </div>
      </aside>

      <main className="ig-main">
        <Outlet />
      </main>
    </div>
  );
}
