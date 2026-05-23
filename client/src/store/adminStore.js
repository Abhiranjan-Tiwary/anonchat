import { create } from "zustand";
import { api } from "../lib/api.js";

const defaultSettings = {
  maintenanceMode: false,
  registrationOpen: true,
  maxRoomSize: 250,
  maxMessageLength: 280,
  rateLimitPerMinute: 20,
  profanityFilter: true,
  guestModeAllowed: true,
  autoDeleteMessages: true,
  emailNotifications: false,
};

export const useAdminStore = create((set, get) => ({
  loading: false,
  error: "",
  users: [],
  rooms: [],
  messages: [],
  reports: [],
  auditLogs: [],
  announcements: [],
  settings: defaultSettings,
  stats: { online: 0, users: 0, openReports: 0, hiddenMessages: 0 },

  async load(token) {
    if (!token) return;
    set({ loading: true, error: "" });
    try {
      const [publicState, adminState, announcementsState, settingsState] = await Promise.all([
        api("/api/state"),
        api("/api/admin/state", { method: "POST", token, body: { token } }),
        api("/api/admin/announcements", { token }).catch(() => ({ announcements: [] })),
        api("/api/admin/settings", { token }).catch(() => ({ settings: defaultSettings })),
      ]);

      set({
        rooms: publicState.rooms || [],
        messages: adminState.messages || publicState.messages || [],
        stats: publicState.stats || {},
        users: adminState.users || [],
        reports: adminState.reports || [],
        auditLogs: adminState.auditLogs || [],
        announcements: announcementsState.announcements || [],
        settings: settingsState.settings || defaultSettings,
        loading: false,
      });
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  async updateUserStatus(token, userId, status, reason = "") {
    await api(`/api/admin/users/${userId}/status`, {
      method: "PATCH",
      token,
      body: { token, status, reason },
    });
    await get().load(token);
  },

  async deleteUser(token, userId) {
    await api(`/api/admin/users/${userId}`, { method: "DELETE", token, body: { token } });
    await get().load(token);
  },

  async updateReport(token, reportId, action) {
    await api(`/api/admin/reports/${reportId}`, { method: "PATCH", token, body: { token, action } });
    await get().load(token);
  },

  async createRoom(token, room) {
    await api("/api/admin/rooms", { method: "POST", token, body: { token, room } });
    await get().load(token);
  },

  async updateRoom(token, roomId, room) {
    await api(`/api/admin/rooms/${roomId}`, { method: "PATCH", token, body: { token, room } });
    await get().load(token);
  },

  async deleteRoom(token, roomId) {
    await api(`/api/admin/rooms/${roomId}`, { method: "DELETE", token, body: { token } });
    await get().load(token);
  },

  async flagMessage(token, messageId, action = "flag") {
    await api(`/api/admin/messages/${messageId}`, { method: "PATCH", token, body: { token, action } });
    await get().load(token);
  },

  async deleteMessage(token, messageId) {
    await api(`/api/admin/messages/${messageId}`, { method: "DELETE", token, body: { token } });
    await get().load(token);
  },

  async createAnnouncement(token, announcement) {
    await api("/api/admin/announcements", { method: "POST", token, body: { token, announcement } });
    await get().load(token);
  },

  async updateAnnouncement(token, announcementId, announcement) {
    await api(`/api/admin/announcements/${announcementId}`, {
      method: "PATCH",
      token,
      body: { token, announcement },
    });
    await get().load(token);
  },

  async deleteAnnouncement(token, announcementId) {
    await api(`/api/admin/announcements/${announcementId}`, {
      method: "DELETE",
      token,
      body: { token },
    });
    await get().load(token);
  },

  async updateSettings(token, settings) {
    const result = await api("/api/admin/settings", { method: "PATCH", token, body: { token, settings } });
    set({ settings: result.settings || settings });
  },
}));
