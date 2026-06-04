import { create } from "zustand";
import { api } from "../lib/api.js";
import { closeSocket } from "../lib/socket.js";

const STORAGE_KEY = "anonchat-react-session";
const GUEST_STORAGE_KEY = "anonchat-guest-session";
const REGISTER_FIELDS = ["fullName", "username", "email", "password", "dateOfBirth"];
const guestAnimals = ["Wolf", "Fox", "Bear", "Eagle", "Tiger", "Hawk", "Lion", "Panda", "Lynx", "Owl"];
const guestColors = ["Blue", "Red", "Dark", "Gold", "Silver", "Neon", "Jade", "Rose", "Ash", "Storm"];
const guestAvatarColors = {
  Blue: "#60a5fa",
  Red: "#ef4444",
  Dark: "#64748b",
  Gold: "#f59e0b",
  Silver: "#cbd5e1",
  Neon: "#22d3ee",
  Jade: "#10b981",
  Rose: "#fb7185",
  Ash: "#94a3b8",
  Storm: "#818cf8",
};

function loadSession() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
  } catch {
    return null;
  }
}

function loadGuestSession() {
  try {
    return JSON.parse(sessionStorage.getItem(GUEST_STORAGE_KEY) || "null");
  } catch {
    return null;
  }
}

function saveSession(session) {
  if (session) localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  else localStorage.removeItem(STORAGE_KEY);
}

function saveGuestSession(session) {
  if (session) sessionStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(session));
  else sessionStorage.removeItem(GUEST_STORAGE_KEY);
}

function randomFrom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function randomId(length = 8) {
  const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");
}

function createGuestSession() {
  const color = randomFrom(guestColors);
  const animal = randomFrom(guestAnimals);
  const suffix = Math.floor(1000 + Math.random() * 9000);
  const guestName = `${color}${animal}#${suffix}`;
  const guestId = `guest_${randomId(10)}`;
  const guestSession = {
    isGuest: true,
    guestId,
    guestName,
    avatarColor: guestAvatarColors[color] || "#6c63ff",
  };

  return {
    token: "",
    user: {
      id: guestId,
      isGuest: true,
      role: "guest",
      username: guestName,
      name: guestName,
      anonymousName: guestName,
      avatarColor: guestSession.avatarColor,
      guestSession,
    },
  };
}

function normalizeRegisterPayload(payload = {}) {
  return REGISTER_FIELDS.reduce((next, field) => {
    next[field] = typeof payload[field] === "string" ? payload[field].trim() : payload[field] || "";
    return next;
  }, {});
}

const initialSession = loadSession() || loadGuestSession();

function blockedIdsFromUser(user = {}) {
  const ids = [
    ...(Array.isArray(user.blockedUserIds) ? user.blockedUserIds : []),
    ...(Array.isArray(user.blockedUsers) ? user.blockedUsers : []),
  ];

  return [...new Set(ids.map((id) => String(id || "")).filter(Boolean))];
}

export const useAuthStore = create((set, get) => ({
  user: initialSession?.user || null,
  token: initialSession?.token || "",
  isAuthenticated: Boolean(initialSession?.token || initialSession?.user?.isGuest),
  loading: false,
  error: "",
  blockedUsers: blockedIdsFromUser(initialSession?.user),
  blockedUserDetails: [],

  async login(payload) {
    set({ loading: true, error: "" });
    try {
      const session = await api("/api/auth/login", { method: "POST", body: payload });
      saveSession(session);
      saveGuestSession(null);
      set({
        user: session.user,
        token: session.token,
        isAuthenticated: true,
        loading: false,
        blockedUsers: blockedIdsFromUser(session.user),
        blockedUserDetails: [],
      });
      return session;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  async register(payload) {
    set({ loading: true, error: "" });
    try {
      const session = await api("/api/auth/register", { method: "POST", body: normalizeRegisterPayload(payload) });
      saveSession(session);
      saveGuestSession(null);
      set({
        user: session.user,
        token: session.token,
        isAuthenticated: true,
        loading: false,
        blockedUsers: blockedIdsFromUser(session.user),
        blockedUserDetails: [],
      });
      return session;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  async adminLogin(payload) {
    set({ loading: true, error: "" });
    try {
      const session = await api("/api/auth/admin-login", { method: "POST", body: payload });
      saveSession(session);
      saveGuestSession(null);
      set({
        user: session.user,
        token: session.token,
        isAuthenticated: true,
        loading: false,
        blockedUsers: blockedIdsFromUser(session.user),
        blockedUserDetails: [],
      });
      return session;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  async updateProfile(profile) {
    const { token, user } = get();
    if (user?.isGuest) {
      throw new Error("Create a free account to unlock profile editing.");
    }
    set({ loading: true, error: "" });
    try {
      const result = await api("/api/users/profile", {
        method: "PATCH",
        token,
        body: { token, profile },
      });
      const nextUser = result.user || { ...user, ...profile };
      const session = { user: nextUser, token };
      saveSession(session);
      set({ user: nextUser, token, isAuthenticated: true, loading: false });
      return nextUser;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  async loadBlockedUsers() {
    const { token, user } = get();
    if (!token || user?.isGuest) return [];

    const data = await api(`/api/users/blocked?token=${encodeURIComponent(token)}`, { token });
    const details = Array.isArray(data.users)
      ? data.users
      : Array.isArray(data.blockedUsers) && typeof data.blockedUsers[0] === "object"
        ? data.blockedUsers
        : [];
    const ids = Array.isArray(data.blockedUsers)
      ? data.blockedUsers.map((item) => (typeof item === "object" ? item.id : item))
      : details.map((item) => item.id);
    const nextIds = [...new Set(ids.map((id) => String(id || "")).filter(Boolean))];
    const nextUser = { ...user, blockedUserIds: nextIds };

    saveSession({ user: nextUser, token });
    set({ user: nextUser, blockedUsers: nextIds, blockedUserDetails: details });
    return details;
  },

  async blockUser(blockedUserId) {
    const { token, user, blockedUsers, blockedUserDetails } = get();
    if (!token || user?.isGuest) {
      throw new Error("Create a free account to block users.");
    }

    const result = await api("/api/users/block", {
      method: "POST",
      token,
      body: { token, blockedUserId },
    });
    const blockedUser = result.user || null;
    const id = String(result.blockedUserId || blockedUser?.id || blockedUserId || "");
    const nextIds = [...new Set([...blockedUsers, id].filter(Boolean))];
    const nextDetails = blockedUser
      ? [...blockedUserDetails.filter((item) => String(item.id) !== id), blockedUser]
      : blockedUserDetails;
    const nextUser = { ...user, blockedUserIds: nextIds };

    saveSession({ user: nextUser, token });
    set({ user: nextUser, blockedUsers: nextIds, blockedUserDetails: nextDetails });
    return result;
  },

  async unblockUser(blockedUserId) {
    const { token, user, blockedUsers, blockedUserDetails } = get();
    if (!token || user?.isGuest) {
      throw new Error("Create a free account to manage blocked users.");
    }

    const id = String(blockedUserId || "");
    const result = await api("/api/users/unblock", {
      method: "POST",
      token,
      body: { token, blockedUserId: id },
    });
    const nextIds = blockedUsers.filter((item) => String(item) !== id);
    const nextDetails = blockedUserDetails.filter((item) => String(item.id) !== id);
    const nextUser = { ...user, blockedUserIds: nextIds };

    saveSession({ user: nextUser, token });
    set({ user: nextUser, blockedUsers: nextIds, blockedUserDetails: nextDetails });
    return result;
  },

  async logout() {
    const { token, user } = get();
    if (user?.isGuest) {
      closeSocket();
      saveGuestSession(null);
      set({ user: null, token: "", isAuthenticated: false, error: "", blockedUsers: [], blockedUserDetails: [] });
      return;
    }

    try {
      if (token) await api("/api/auth/logout", { method: "POST", token, body: { token } });
    } finally {
      closeSocket();
      saveSession(null);
      saveGuestSession(null);
      set({ user: null, token: "", isAuthenticated: false, error: "", blockedUsers: [], blockedUserDetails: [] });
    }
  },

  startGuest() {
    closeSocket();
    saveSession(null);
    const session = createGuestSession();
    saveGuestSession(session);
    set({ user: session.user, token: "", isAuthenticated: true, loading: false, error: "", blockedUsers: [], blockedUserDetails: [] });
    return session;
  },
}));
