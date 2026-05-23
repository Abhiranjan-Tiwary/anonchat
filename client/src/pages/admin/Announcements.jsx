import { useState } from "react";
import Button from "../../components/Button.jsx";
import Badge from "../../components/Badge.jsx";
import { Card, CardHeader } from "../../components/Card.jsx";
import { useAuthStore } from "../../store/authStore.js";
import { useAdminStore } from "../../store/adminStore.js";
import { useToast } from "../../hooks/useToast.js";
import { relativeTime } from "../../lib/utils.js";

export default function AdminAnnouncements() {
  const token = useAuthStore((state) => state.token);
  const { announcements, createAnnouncement, updateAnnouncement, deleteAnnouncement } = useAdminStore();
  const { toast } = useToast();
  const [form, setForm] = useState({ title: "", body: "", priority: "normal", target: "all" });
  const [editingId, setEditingId] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await updateAnnouncement(token, editingId, form);
        toast("Announcement updated for all users.", "success");
      } else {
        await createAnnouncement(token, form);
        toast("Announcement published.", "success");
      }
      resetForm();
    } finally {
      setLoading(false);
    }
  }

  function editAnnouncement(item) {
    setEditingId(item.id);
    setForm({
      title: item.title || "",
      body: item.body || "",
      priority: item.priority || "normal",
      target: item.target === "rooms" ? "room" : item.target || "all",
    });
  }

  function resetForm() {
    setEditingId("");
    setForm({ title: "", body: "", priority: "normal", target: "all" });
  }

  async function removeAnnouncement(item) {
    if (!window.confirm(`Permanently delete "${item.title}" for all users?`)) return;
    await deleteAnnouncement(token, item.id);
    if (editingId === item.id) resetForm();
    toast("Announcement permanently deleted for all users.", "success");
  }

  return (
    <div className="split-grid">
      <Card>
        <CardHeader title={editingId ? "Edit Announcement" : "Create Announcement"} subtitle="Publish platform alerts, room updates, and safety notices." />
        <form className="form-stack" onSubmit={submit}>
          <label><span>Title</span><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></label>
          <label><span>Body</span><textarea rows="6" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} required /></label>
          <label><span>Priority</span><select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}><option value="normal">Normal</option><option value="high">High</option><option value="critical">Critical</option></select></label>
          <label><span>Target</span><select value={form.target} onChange={(e) => setForm({ ...form, target: e.target.value })}><option value="all">All users</option><option value="room">All rooms</option></select></label>
          <div className="row-actions">
            <Button type="submit" disabled={loading}>{loading ? "Saving..." : editingId ? "Save Announcement" : "Publish Announcement"}</Button>
            {editingId ? <Button type="button" variant="ghost" onClick={resetForm}>Cancel Edit</Button> : null}
          </div>
        </form>
      </Card>
      <Card>
        <CardHeader title="Announcement List" subtitle="Published, draft, and scheduled announcements." />
        <div className="list-stack">
          {announcements.map((item) => (
            <article className="list-card" key={item.id}>
              <div>
                <strong>{item.title}</strong>
                <p>{item.body}</p>
                <small className="mono">
                  {item.target === "room" || item.target === "rooms" ? "All rooms" : "All users"} - {item.updatedAt ? `Updated ${relativeTime(item.updatedAt)}` : relativeTime(item.createdAt)}
                </small>
              </div>
              <div className="announcement-actions">
                <Badge tone={item.priority === "critical" ? "red" : item.priority === "high" ? "amber" : "purple"}>{item.priority}</Badge>
                <Button size="sm" variant="ghost" onClick={() => editAnnouncement(item)}>Edit</Button>
                <Button size="sm" variant="danger-ghost" onClick={() => removeAnnouncement(item)}>Delete</Button>
              </div>
            </article>
          ))}
          {!announcements.length ? <div className="empty-state"><span>AN</span><strong>No announcements</strong><p>Create the first broadcast for AnonChat users.</p></div> : null}
        </div>
      </Card>
    </div>
  );
}
