import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../lib/api.js";
import { useAuthStore } from "../../store/authStore.js";

export default function Search() {
  const token = useAuthStore((state) => state.token);
  const [query, setQuery] = useState("");
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    let active = true;
    api("/api/state", { token })
      .then((state) => active && setRooms(state.rooms || []))
      .catch(() => active && setRooms([]));
    return () => { active = false; };
  }, [token]);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return rooms;
    return rooms.filter((room) => `${room.name} ${room.description || room.desc || ""}`.toLowerCase().includes(term));
  }, [query, rooms]);

  return (
    <div className="ig-page ig-single-column-page">
      <div className="ig-page-head">
        <h1>Search</h1>
        <p>Find people, rooms, posts and topics.</p>
      </div>
      <label className="ig-search-box">
        <span>⌕</span>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search AnonChat" autoFocus />
      </label>
      <section className="ig-result-card">
        {results.map((room) => (
          <Link className="ig-suggested-user" key={room.id} to={`/dashboard/rooms/${room.id}`}>
            <span className="ig-room-dot" style={{ background: room.color || "#8b5cf6" }}>{room.icon || "#"}</span>
            <div>
              <strong>{room.name}</strong>
              <span>{room.description || room.desc || "Open conversation"}</span>
            </div>
            <em>Open</em>
          </Link>
        ))}
        {!results.length ? <p className="ig-muted-text">No matching results.</p> : null}
      </section>
    </div>
  );
}
