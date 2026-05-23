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
        // The dashboard can still run if notification hydration briefly fails.
      }
    }

    function handleState(payload) {
      syncAnnouncements(payload?.announcements || []);
    }

    function handleAnnouncement(announcement) {
      addAnnouncement(announcement);
      toast(`Announcement: ${announcement.title || "New update"}`, "success");
    }

    function handleAnnouncementUpdate(announcement) {
      updateAnnouncement(announcement);
      toast(`Announcement updated: ${announcement.title || "Update"}`, "info");
    }

    function handleAnnouncementDelete(payload) {
      deleteAnnouncement(payload?.id || payload?.announcementId);
      toast("Announcement removed by admin.", "info");
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
    <div className="user-app">
      <aside className="user-sidebar">
        <div className="admin-brand">
          <img className="brand-logo-img" src="/assets/logo/logo.png" alt="AnonChat logo" />
          <div>
            <strong>AnonChat</strong>
            <small>Anonymous rooms</small>
          </div>
        </div>
        <nav className="admin-shell-nav">
          <NavLink to="/dashboard" end className={({ isActive }) => `admin-shell-link ${isActive ? "active" : ""}`}>
            <span>HM</span>
            <strong>Home</strong>
          </NavLink>
          <NavLink to="/dashboard/rooms/general" className={({ isActive }) => `admin-shell-link ${isActive ? "active" : ""}`}>
            <span>CH</span>
            <strong>Chat Room</strong>
          </NavLink>
          <NavLink to="/dashboard/profile" className={({ isActive }) => `admin-shell-link ${isActive ? "active" : ""}`}>
            <span>PF</span>
            <strong>Profile</strong>
          </NavLink>
          <NavLink to="/dashboard/settings" className={({ isActive }) => `admin-shell-link ${isActive ? "active" : ""}`}>
            <span>ST</span>
            <strong>Settings</strong>
          </NavLink>
          <NavLink to="/dashboard/notifications" className={({ isActive }) => `admin-shell-link ${isActive ? "active" : ""}`}>
            <span className={`nav-bell-icon ${visibleUnreadCount ? "has-unread" : ""}`}>🔔</span>
            <strong>Notifications</strong>
          </NavLink>
        </nav>
        <div className="profile-chip">
          <Avatar name={user?.name || user?.anonymousName || "Anonymous"} src={user?.avatarDataUrl} color={user?.avatarColor} />
          <div>
            <strong>{user?.anonymousName || "Anonymous User"}</strong>
            {user?.isGuest ? <span className="guest-mode-badge">Guest Mode</span> : <small>@{user?.username || "guest"}</small>}
          </div>
        </div>
        <Button variant="ghost" onClick={handleLogout}>Logout</Button>
      </aside>
      <main className="user-main">
        <Outlet />
      </main>
    </div>
  );
}
