import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Avatar from "../../components/Avatar.jsx";
import { api } from "../../lib/api.js";
import { getSocket } from "../../lib/socket.js";
import { useAuthStore } from "../../store/authStore.js";

export default function Messages() {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const [state, setState] = useState({ rooms: [], messages: [], stats: { online: 0 } });
  const [activeTyping, setActiveTyping] = useState("");

  useEffect(() => {
    let active = true;

    async function loadState() {
      try {
        const nextState = await api("/api/state", { token });
        if (active) setState(nextState);
      } catch {
        // DM shell still renders even when the initial state is unavailable.
      }
    }

    loadState();
    if (!token) return () => { active = false; };

    const socket = getSocket(token);
    const handleState = (payload) => setState(payload);
    const handleRoomsUpdate = (payload) => setState((current) => ({ ...current, rooms: payload.rooms || current.rooms, stats: payload.stats || current.stats }));
    const handleTyping = (payload) => setActiveTyping(payload?.name || payload?.anonymousName || "Someone");
    const clearTyping = () => setActiveTyping("");

    socket.off("state", handleState);
    socket.off("rooms:update", handleRoomsUpdate);
    socket.off("typing:start", handleTyping);
    socket.off("typing:stop", clearTyping);
    socket.on("state", handleState);
    socket.on("rooms:update", handleRoomsUpdate);
    socket.on("typing:start", handleTyping);
    socket.on("typing:stop", clearTyping);

    if (!socket.connected) socket.connect();
    socket.emit("presence:online", { token });

    return () => {
      active = false;
      socket.off("state", handleState);
      socket.off("rooms:update", handleRoomsUpdate);
      socket.off("typing:start", handleTyping);
      socket.off("typing:stop", clearTyping);
    };
  }, [token]);

  const conversations = useMemo(() => {
    return (state.rooms || []).map((room) => {
      const lastMessage = (state.messages || []).filter((message) => message.roomId === room.id || message.room === room.id).at(-1);
      return {
        id: room.id,
        name: room.name,
        color: room.color || "#8b5cf6",
        icon: room.icon || "#",
        online: Number(room.onlineMembers || room.activeMembers || 0),
        lastMessage: lastMessage?.text || lastMessage?.body || room.description || "Open this conversation",
      };
    });
  }, [state.messages, state.rooms]);

  const featured = conversations[0];

  return (
    <div className="ig-page ig-messages-page">
      <section className="ig-dm-sidebar">
        <div className="ig-dm-title">
          <div>
            <strong>{user?.anonymousName || user?.name || "AnonChat"}</strong>
            <span>Instagram-style DMs</span>
          </div>
          <Link to="/dashboard/create">✎</Link>
        </div>

        <div className="ig-dm-search">Search conversations</div>

        <div className="ig-dm-list">
          {conversations.map((conversation) => (
            <Link className="ig-dm-row" key={conversation.id} to={`/dashboard/rooms/${conversation.id}`}>
              <span className="ig-room-dot large" style={{ background: conversation.color }}>{conversation.icon}</span>
              <div>
                <strong>{conversation.name}</strong>
                <span>{conversation.lastMessage}</span>
              </div>
              <em>{conversation.online}</em>
            </Link>
          ))}
        </div>
      </section>

      <section className="ig-dm-window">
        {featured ? (
          <>
            <header>
              <div>
                <span className="ig-room-dot large" style={{ background: featured.color }}>{featured.icon}</span>
                <div>
                  <strong>{featured.name}</strong>
                  <span>{activeTyping ? `${activeTyping} is typing...` : `${featured.online} online · Seen just now`}</span>
                </div>
              </div>
              <Link to={`/dashboard/rooms/${featured.id}`}>Open full chat</Link>
            </header>
            <div className="ig-dm-preview">
              <p className="incoming">Welcome to your upgraded DM experience.</p>
              <p className="outgoing">Existing Socket.io chat is preserved inside rooms.</p>
              <p className="incoming">Image sharing, typing, reactions, reports and blocks still work there.</p>
            </div>
            <div className="ig-dm-composer">
              <span>😊</span>
              <input disabled placeholder="Use Open full chat to send messages" />
              <span>🖼</span>
              <span>♡</span>
            </div>
          </>
        ) : (
          <div className="ig-empty-state">
            <Avatar name="Messages" />
            <strong>Your messages</strong>
            <p>Conversations will appear here once rooms are available.</p>
          </div>
        )}
      </section>
    </div>
  );
}
