import { create } from "zustand";

const STORAGE_KEY = "anonchat-notifications";

const seedNotificationIds = new Set(["system-welcome", "invite-random-talk", "announcement-safety"]);

function loadNotifications() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const items = saved ? JSON.parse(saved) : [];
    return Array.isArray(items) ? items.filter((item) => !seedNotificationIds.has(item.id)) : [];
  } catch {
    return [];
  }
}

function saveNotifications(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // localStorage can be blocked in private contexts.
  }
}

function notificationFromAnnouncement(announcement, existing) {
  const title = announcement.title || "Announcement";
  const body = announcement.body || "";
  const target = announcement.target === "room" || announcement.target === "rooms" ? "All rooms" : "All users";

  return {
    id: `announcement:${announcement.id}`,
    type: "Announcement",
    title,
    body: `${title}: ${body}`,
    target,
    sourceId: announcement.id,
    createdAt: announcement.createdAt || Date.now(),
    time: relativeTime(announcement.createdAt || Date.now()),
    unread: existing ? existing.unread : true,
  };
}

function relativeTime(timestamp) {
  const diff = Math.max(0, Date.now() - Number(timestamp || Date.now()));
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) return "Now";
  if (diff < hour) return `${Math.floor(diff / minute)}m`;
  if (diff < day) return `${Math.floor(diff / hour)}h`;
  return `${Math.floor(diff / day)}d`;
}

function mergeAnnouncements(current, announcements, forceUnread = false) {
  const existingById = new Map(current.map((item) => [item.id, item]));
  const incoming = (announcements || [])
    .filter((announcement) => announcement?.id)
    .map((announcement) => {
      const id = `announcement:${announcement.id}`;
      const existing = existingById.get(id);
      const item = notificationFromAnnouncement(announcement, existing);
      return forceUnread && !existing ? { ...item, unread: true, time: "Now" } : item;
    });

  const incomingIds = new Set(incoming.map((item) => item.id));
  return [...incoming, ...current.filter((item) => !incomingIds.has(item.id))].sort(
    (first, second) => Number(second.createdAt || 0) - Number(first.createdAt || 0)
  );
}

function syncAnnouncementList(current, announcements) {
  const existingById = new Map(current.map((item) => [item.id, item]));
  const incoming = (announcements || [])
    .filter((announcement) => announcement?.id)
    .map((announcement) => notificationFromAnnouncement(announcement, existingById.get(`announcement:${announcement.id}`)));
  const otherNotifications = current.filter((item) => !String(item.id || "").startsWith("announcement:"));

  return [...incoming, ...otherNotifications].sort(
    (first, second) => Number(second.createdAt || 0) - Number(first.createdAt || 0)
  );
}

export const useNotificationStore = create((set, get) => ({
  items: loadNotifications(),
  get unreadCount() {
    return get().items.filter((item) => item.unread).length;
  },
  markAllRead() {
    set((state) => {
      const items = state.items.map((item) => ({ ...item, unread: false }));
      saveNotifications(items);
      return { items };
    });
  },
  markRead(id) {
    set((state) => {
      const items = state.items.map((item) => (item.id === id ? { ...item, unread: false } : item));
      saveNotifications(items);
      return { items };
    });
  },
  syncAnnouncements(announcements = []) {
    set((state) => {
      const items = syncAnnouncementList(state.items, announcements);
      saveNotifications(items);
      return { items };
    });
  },
  addAnnouncement(announcement) {
    if (!announcement?.id) return;
    set((state) => {
      const items = mergeAnnouncements(state.items, [announcement], true);
      saveNotifications(items);
      return { items };
    });
  },
  updateAnnouncement(announcement) {
    if (!announcement?.id) return;
    set((state) => {
      const items = mergeAnnouncements(state.items, [announcement], false);
      saveNotifications(items);
      return { items };
    });
  },
  deleteAnnouncement(announcementId) {
    set((state) => {
      const id = `announcement:${announcementId}`;
      const items = state.items.filter((item) => item.id !== id && item.sourceId !== announcementId);
      saveNotifications(items);
      return { items };
    });
  },
}));
