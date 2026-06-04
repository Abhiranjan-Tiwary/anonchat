import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Avatar from "../../components/Avatar.jsx";
import Button from "../../components/Button.jsx";
import { api } from "../../lib/api.js";
import { getSocket } from "../../lib/socket.js";
import { useAuthStore } from "../../store/authStore.js";

const fallbackStories = ["Campus", "Design", "Code", "Memes", "Events", "Music", "Sports"];

const fallbackPosts = [
  {
    id: "p-campus-night",
    author: "Campus Circle",
    username: "campus.circle",
    avatarColor: "#f97316",
    image: "linear-gradient(135deg, rgba(236,72,153,.95), rgba(99,102,241,.9), rgba(14,165,233,.85))",
    caption: "Late night coding, chai, and new ideas. Welcome to the new AnonChat social feed.",
    likes: 1284,
    comments: 84,
    time: "12m",
  },
  {
    id: "p-dev-room",
    author: "Dev Room",
    username: "dev.room",
    avatarColor: "#22c55e",
    image: "linear-gradient(135deg, rgba(34,197,94,.9), rgba(20,184,166,.85), rgba(2,6,23,.95))",
    caption: "Frontend polish, realtime sockets, and smooth UI. Build mode is on.",
    likes: 943,
    comments: 51,
    time: "38m",
  },
  {
    id: "p-anon-vibes",
    author: "Anon Vibes",
    username: "anon.vibes",
    avatarColor: "#a855f7",
    image: "linear-gradient(135deg, rgba(168,85,247,.92), rgba(244,63,94,.86), rgba(15,23,42,.95))",
    caption: "Share thoughts, find people, join conversations — safely and beautifully.",
    likes: 2217,
    comments: 129,
    time: "1h",
  },
];

export default function Home() {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const [state, setState] = useState({ rooms: [], messages: [], stats: { online: 0 } });
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState(() => new Set());
  const [savedPosts, setSavedPosts] = useState(() => new Set());

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

  const stories = useMemo(() => {
    const roomStories = rooms.slice(0, 8).map((room) => ({ name: room.name, color: room.color }));
    return roomStories.length ? roomStories : fallbackStories.map((name) => ({ name, color: "#8b5cf6" }));
  }, [rooms]);

  const messagesToday = useMemo(
    () => (state.messages || []).filter((message) => isToday(message.createdAt)).length,
    [state.messages]
  );

  function toggleSet(setter, id) {
    setter((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="ig-page ig-feed-page">
      <section className="ig-feed-column">
        <div className="ig-stories-row" aria-label="Stories">
          <button className="ig-story-card ig-story-card-own" type="button">
            <Avatar name={user?.anonymousName || user?.name || "You"} src={user?.avatarDataUrl} color={user?.avatarColor} />
            <span>Your story</span>
            <em>+</em>
          </button>
          {stories.map((story) => (
            <button className="ig-story-card" type="button" key={story.name}>
              <span className="ig-story-ring" style={{ "--story-color": story.color }}>
                <Avatar name={story.name} color={story.color} />
              </span>
              <span>{story.name}</span>
            </button>
          ))}
        </div>

        <div className="ig-feed-list">
          {fallbackPosts.map((post) => {
            const liked = likedPosts.has(post.id);
            const saved = savedPosts.has(post.id);
            return (
              <article className="ig-post-card" key={post.id}>
                <header className="ig-post-head">
                  <div>
                    <Avatar name={post.author} color={post.avatarColor} />
                    <div>
                      <strong>{post.author}</strong>
                      <span>@{post.username} · {post.time}</span>
                    </div>
                  </div>
                  <button type="button" aria-label="Post menu">•••</button>
                </header>

                <div className="ig-post-media" style={{ background: post.image }}>
                  <span>{post.author}</span>
                </div>

                <div className="ig-post-actions">
                  <button className={liked ? "active" : ""} type="button" onClick={() => toggleSet(setLikedPosts, post.id)}>{liked ? "♥" : "♡"}</button>
                  <button type="button">💬</button>
                  <button type="button">↗</button>
                  <button className={saved ? "active" : ""} type="button" onClick={() => toggleSet(setSavedPosts, post.id)}>{saved ? "◆" : "◇"}</button>
                </div>

                <div className="ig-post-copy">
                  <strong>{formatNumber(post.likes + (liked ? 1 : 0))} likes</strong>
                  <p><b>{post.username}</b> {post.caption}</p>
                  <button type="button">View all {formatNumber(post.comments)} comments</button>
                  <input placeholder="Add a comment..." />
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <aside className="ig-right-panel">
        <div className="ig-account-card">
          <Avatar name={user?.anonymousName || user?.name || "Anonymous"} src={user?.avatarDataUrl} color={user?.avatarColor} />
          <div>
            <strong>{user?.anonymousName || user?.name || "Anonymous User"}</strong>
            <span>@{user?.username || "anonchat"}</span>
          </div>
          <Link to="/dashboard/profile">View</Link>
        </div>

        <section className="ig-mini-stats">
          <div><strong>{loading ? "..." : formatNumber(state.stats?.online || 0)}</strong><span>Online</span></div>
          <div><strong>{loading ? "..." : formatNumber(rooms.length)}</strong><span>Rooms</span></div>
          <div><strong>{loading ? "..." : formatNumber(messagesToday)}</strong><span>Today</span></div>
        </section>

        <section className="ig-suggested-card">
          <div className="ig-section-title">
            <strong>Suggested spaces</strong>
            <Link to="/dashboard/messages">See all</Link>
          </div>
          {rooms.slice(0, 5).map((room) => (
            <Link className="ig-suggested-user" key={room.id} to={`/dashboard/rooms/${room.id}`}>
              <span className="ig-room-dot" style={{ background: room.color }}>{room.icon}</span>
              <div>
                <strong>{room.name}</strong>
                <span>{formatNumber(room.online)} online</span>
              </div>
              <em>Open</em>
            </Link>
          ))}
        </section>
      </aside>
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
