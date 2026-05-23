import { useEffect } from "react";
import { getSocket } from "../lib/socket.js";
import { useAuthStore } from "../store/authStore.js";

export function useSocket(events = {}) {
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (!token) return undefined;
    const socket = getSocket(token);
    socket.connect();

    Object.entries(events).forEach(([event, handler]) => socket.on(event, handler));

    return () => {
      Object.entries(events).forEach(([event, handler]) => socket.off(event, handler));
    };
  }, [events, token]);
}
