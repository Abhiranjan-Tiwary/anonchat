import { useState } from "react";
import Button from "../../components/ui/Button.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Modal from "../../components/ui/Modal.jsx";
import ConfirmModal from "../../components/ui/ConfirmModal.jsx";
import { Card, CardHeader } from "../../components/ui/Card.jsx";
import Toggle from "../../components/ui/Toggle.jsx";
import { useAuthStore } from "../../store/authStore.js";
import { useAdminStore } from "../../store/adminStore.js";
import { useToast } from "../../hooks/useToast.js";
import { relativeTime, truncate } from "../../lib/utils.js";

const emptyRoom = {
  name: "",
  desc: "",
  category: "Public",
  maxCapacity: 250,
  visibility: "public",
  passwordProtected: false,
  password: "",
  icon: "CR",
  color: "#6C63FF",
};

export default function AdminChatRooms() {
  const token = useAuthStore((state) => state.token);
  const { rooms, messages, createRoom, updateRoom, deleteRoom } = useAdminStore();
  const { toast } = useToast();
  const [formOpen, setFormOpen] = useState(false);
  const [historyRoom, setHistoryRoom] = useState(null);
  const [editingRoom, setEditingRoom] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState(emptyRoom);
  const [loading, setLoading] = useState(false);

  function openCreate() {
    setEditingRoom(null);
    setForm(emptyRoom);
    setFormOpen(true);
  }

  function openEdit(room) {
    setEditingRoom(room);
    setForm({
      ...emptyRoom,
      ...room,
      maxCapacity: room.maxCapacity || 250,
      visibility: room.visibility || "public",
      passwordProtected: Boolean(room.passwordProtected),
      password: "",
    });
    setFormOpen(true);
  }

  async function saveRoom() {
    if (form.name.trim().length < 3) return toast("Room name must be at least 3 characters.", "danger");
    setLoading(true);
    try {
      if (editingRoom) {
        await updateRoom(token, editingRoom.id, form);
        toast("Room updated.", "success");
      } else {
        await createRoom(token, form);
        toast("Room created.", "success");
      }
      setFormOpen(false);
    } finally {
      setLoading(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setLoading(true);
    try {
      await deleteRoom(token, deleteTarget.id);
      toast("Room deleted.", "success");
      setDeleteTarget(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Card>
        <CardHeader title="Chat Rooms" subtitle="Manage room capacity, visibility, protection, and history." action={<Button onClick={openCreate}>Create Room</Button>} />
        {rooms.length ? (
          <div className="adm-table-scroll admin-room-table-wrap">
            <table className="adm-table admin-room-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Members</th>
                  <th>Created</th>
                  <th>Visibility</th>
                  <th>Password</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room) => {
                  const roomMessages = messages.filter((message) => message.roomId === room.id);

                  return (
                    <tr key={room.id}>
                      <td>
                        <div className="admin-room-name">
                          <strong>{room.name}</strong>
                          <small>{room.desc || "No description"}</small>
                        </div>
                      </td>
                      <td><span className="mono">{room.activeMembers || roomMessages.length || 0}</span></td>
                      <td><span className="mono">{room.createdAt ? relativeTime(room.createdAt) : "Seeded"}</span></td>
                      <td><Badge tone={room.visibility === "private" ? "amber" : room.hidden ? "gray" : "green"}>{room.visibility || (room.hidden ? "hidden" : "public")}</Badge></td>
                      <td><Badge tone={room.passwordProtected ? "purple" : "gray"}>{room.passwordProtected ? "Protected" : "Open"}</Badge></td>
                      <td>
                        <div className="row-actions">
                          <Button size="sm" variant="ghost" onClick={() => setHistoryRoom(room)}>View</Button>
                          <Button size="sm" variant="ghost" onClick={() => openEdit(room)}>Edit</Button>
                          <Button size="sm" variant="danger-ghost" onClick={() => setDeleteTarget(room)}>Delete</Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <span>CR</span>
            <strong>No rooms yet</strong>
            <p>Create the first room for AnonChat users.</p>
          </div>
        )}
      </Card>

      <Modal open={formOpen} title={editingRoom ? "Edit Room" : "Create Room"} confirmLabel={editingRoom ? "Save Room" : "Create Room"} loading={loading} onClose={() => setFormOpen(false)} onConfirm={saveRoom}>
        <div className="form-stack">
          <label><span>Name</span><input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
          <label><span>Description</span><textarea rows="3" value={form.desc} onChange={(event) => setForm({ ...form, desc: event.target.value })} /></label>
          <div className="form-grid">
            <label><span>Max capacity</span><input type="number" min="2" value={form.maxCapacity} onChange={(event) => setForm({ ...form, maxCapacity: Number(event.target.value) })} /></label>
            <label><span>Visibility</span><select value={form.visibility} onChange={(event) => setForm({ ...form, visibility: event.target.value })}><option value="public">Public</option><option value="private">Private</option></select></label>
          </div>
          <div className="setting-row compact-row">
            <div><strong>Password protected</strong><p>Require a password before joining this room.</p></div>
            <Toggle checked={form.passwordProtected} onChange={(value) => setForm({ ...form, passwordProtected: value })} />
          </div>
          {form.passwordProtected ? <label><span>Password</span><input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /></label> : null}
        </div>
      </Modal>

      <Modal open={Boolean(historyRoom)} title={historyRoom?.name || "Room History"} confirmLabel="Close" onClose={() => setHistoryRoom(null)} onConfirm={() => setHistoryRoom(null)}>
        <div className="message-history">
          {messages.filter((message) => message.roomId === historyRoom?.id).slice(-12).reverse().map((message) => (
            <article key={message.id} className={message.reported ? "is-flagged" : ""}>
              <strong>{message.userName || "Anonymous User"}</strong>
              <p>{truncate(message.text || message.attachment?.name || "Media message", 130)}</p>
              <small className="mono">{relativeTime(message.createdAt)}</small>
            </article>
          ))}
          {!messages.some((message) => message.roomId === historyRoom?.id) ? <div className="empty-state compact"><span>MH</span><strong>No messages</strong><p>This room has no visible message history.</p></div> : null}
        </div>
      </Modal>

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete Room"
        message={`Delete ${deleteTarget?.name || "this room"} and its messages?`}
        confirmLabel="Delete Room"
        danger
        loading={loading}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </>
  );
}
