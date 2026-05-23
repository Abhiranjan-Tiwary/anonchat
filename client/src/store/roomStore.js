import { create } from "zustand";
import { api } from "../lib/api.js";

export const useRoomStore = create((set, get) => ({
  rooms: [],
  messages: [],
  loading: false,
  activeRoomId: "general",
  setActiveRoom: (activeRoomId) => set({ activeRoomId }),
  async loadRooms() {
    set({ loading: true });
    const state = await api("/api/state");
    set({ rooms: state.rooms || [], messages: state.messages || [], loading: false });
  },
  async loadRoomMessages(roomId) {
    const result = await api(`/api/rooms/${roomId}/messages`).catch(() => ({ messages: get().messages.filter((message) => message.roomId === roomId) }));
    set({ messages: result.messages || [] });
  },
}));
