import { io } from "socket.io-client";

let socket;

export function getSocket(token) {
  if (!socket) {
    socket = io(import.meta.env.VITE_SOCKET_URL || "/", {
      autoConnect: false,
      transports: ["websocket", "polling"],
    });
  }

  socket.auth = { token };
  return socket;
}

export function closeSocket() {
  if (socket) socket.disconnect();
}
