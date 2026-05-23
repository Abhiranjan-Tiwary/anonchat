import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CardHeader } from "../../components/Card.jsx";
import { api } from "../../lib/api.js";
import { getSocket } from "../../lib/socket.js";
import { useAuthStore } from "../../store/authStore.js";

export default function Home() {
  const token = useAuthStore((state) => state.token);
  const [state, setState] = useState({ rooms: [], messages: [], stats: { online: 0 } });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadState() {
      try {
        const nextState = await api("/api/state", { token });
        if (active) setState(nextState);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadState();

    if (!token) {
      return () => {
        active = false;
      };
    }

    const socket = getSocket(token);
    const handleState = (payload) => setState(payload);
    const handleRoomsUpdate = (payload) =>
      setState((current) => ({
        ...current,
        rooms: payload.rooms || current.rooms,
        stats: payload.stats || current.stats,
      }));

    socket.off("state", handleState);
    socket.off("rooms:update", handleRoomsUpdate);
    socket.on("state", handleState);
    socket.on("rooms:update", handleRoomsUpdate);

    if (!socket.connected) socket.connect();
    socket.emit("presence:online", { token });

    return () => {
      active = false;
      socket.off("state", handleState);
      socket.off("rooms:update", handleRoomsUpdate);
    };
  }, [token]);

  const rooms = useMemo(
    () =>
      (state.rooms || []).map((room) => ({
        id: room.id,
        name: room.name,
        icon: room.icon || "#",
        color: room.color || "#6c63ff",
        description: room.description || room.desc || "",
        online: Number(room.onlineMembers || room.activeMembers || 0),
      })),
    [state.rooms]
  );

  const messagesToday = useMemo(
    () => (state.messages || []).filter((message) => isToday(message.createdAt)).length,
    [state.messages]
  );

  return (
    <div className="workspace-page">
      <CardHeader title="Browse Rooms" subtitle="Join an anonymous room and start chatting safely." />
      <section className="user-stats-bar" aria-label="Workspace stats">
        <div><span className="stat-emoji">ON</span><strong>{loading ? "..." : formatNumber(state.stats?.online || 0)}</strong><span>Users Online</span></div>
        <div><span className="stat-emoji">RM</span><strong>{loading ? "..." : formatNumber(rooms.length)}</strong><span>Active Rooms</span></div>
        <div><span className="stat-emoji">MS</span><strong>{loading ? "..." : formatNumber(messagesToday)}</strong><span>Messages Today</span></div>
      </section>
      <div className="room-grid">
        {rooms.map((room) => (
          <Link className="room-card premium-room-card" key={room.id} to={`/dashboard/rooms/${room.id}`}>
            <span className="room-icon" style={{ "--room-color": room.color }}>{room.icon}</span>
            <div className="room-card-title">
              <strong>{room.name}</strong>
            </div>
            <small className="member-badge"><span />{loading ? "..." : formatNumber(room.online)} online</small>
            <p>{room.description}</p>
            <span className="join-room-btn">Join Room -&gt;</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function isToday(timestamp) {
  if (!timestamp) return false;
  const date = new Date(Number(timestamp));
  const now = new Date();
  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth() && date.getDate() === now.getDate();
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString();
}
