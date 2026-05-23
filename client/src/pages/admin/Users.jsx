import { useMemo, useState } from "react";
import Button from "../../components/ui/Button.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Modal from "../../components/ui/Modal.jsx";
import Drawer from "../../components/ui/Drawer.jsx";
import Table from "../../components/ui/Table.jsx";
import { Card, CardHeader } from "../../components/ui/Card.jsx";
import { useAuthStore } from "../../store/authStore.js";
import { useAdminStore } from "../../store/adminStore.js";
import { useToast } from "../../hooks/useToast.js";
import { relativeTime } from "../../lib/utils.js";
import { UserCell } from "./pageUtils.jsx";

const PAGE_SIZE = 8;

export default function AdminUsers() {
  const token = useAuthStore((state) => state.token);
  const { users, messages, updateUserStatus, deleteUser } = useAdminStore();
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [detailUser, setDetailUser] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [reason, setReason] = useState("Community safety");
  const [loading, setLoading] = useState(false);

  const filtered = useMemo(() => users.filter((user) => {
    const haystack = `${user.fullName} ${user.username} ${user.email}`.toLowerCase();
    const matchesQuery = haystack.includes(query.toLowerCase());
    const normalizedStatus = user.status === "suspended" ? "banned" : user.role === "guest" ? "guest" : "active";
    return matchesQuery && (status === "all" || normalizedStatus === status);
  }), [query, status, users]);
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visibleUsers = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  async function runAction() {
    if (!confirm) return;
    setLoading(true);
    try {
      if (confirm.type === "delete") {
        await deleteUser(token, confirm.user.id);
        toast("User deleted.", "success");
      } else {
        await updateUserStatus(token, confirm.user.id, confirm.type === "ban" ? "suspended" : "active", reason);
        toast(confirm.type === "ban" ? "User banned." : "User unbanned.", "success");
      }
      setConfirm(null);
    } finally {
      setLoading(false);
    }
  }

  const rows = visibleUsers.map((user) => {
    const banned = user.status === "suspended";
    return {
      id: user.id,
      cells: [
        <UserCell user={user} />,
        <span className="mono">{user.email || "No email"}</span>,
        <span className="mono">{relativeTime(user.createdAt)}</span>,
        <Badge tone={banned ? "red" : user.role === "guest" ? "gray" : "green"}>{banned ? "Banned" : user.role === "guest" ? "Guest" : "Active"}</Badge>,
        <div className="row-actions">
          <Button size="sm" variant="ghost" onClick={() => setDetailUser(user)}>View</Button>
          <Button size="sm" variant="ghost" onClick={() => { setReason("Community safety"); setConfirm({ type: banned ? "unban" : "ban", user }); }}>{banned ? "Unban" : "Ban"}</Button>
          <Button size="sm" variant="danger-ghost" onClick={() => setConfirm({ type: "delete", user })}>Delete</Button>
        </div>,
      ],
    };
  });

  return (
    <>
      <Card>
        <CardHeader
          title="User Directory"
          subtitle="Paginated accounts with profile drawer, safety actions, and status filters."
          action={
            <div className="toolbar">
              <input placeholder="Search username or email" value={query} onChange={(event) => { setPage(1); setQuery(event.target.value); }} />
              <select value={status} onChange={(event) => { setPage(1); setStatus(event.target.value); }}>
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="banned">Banned</option>
                <option value="guest">Guest</option>
              </select>
            </div>
          }
        />
        <Table columns={["Avatar / Username", "Email", "Joined", "Status", "Actions"]} rows={rows} emptyTitle="No matching users" />
        <div className="pagination">
          <Button size="sm" variant="ghost" disabled={page === 1} onClick={() => setPage((value) => value - 1)}>Previous</Button>
          <span className="mono">Page {page} of {pages}</span>
          <Button size="sm" variant="ghost" disabled={page === pages} onClick={() => setPage((value) => value + 1)}>Next</Button>
        </div>
      </Card>

      <UserDetailDrawer user={detailUser} messages={messages} onClose={() => setDetailUser(null)} />

      <Modal
        open={Boolean(confirm)}
        title={confirm?.type === "delete" ? "Delete User" : confirm?.type === "ban" ? "Ban User" : "Unban User"}
        confirmLabel={confirm?.type === "delete" ? "Delete Account" : confirm?.type === "ban" ? "Ban User" : "Unban User"}
        loading={loading}
        onClose={() => setConfirm(null)}
        onConfirm={runAction}
      >
        <div className="form-stack">
          <p className="modal-copy">
            {confirm?.type === "delete"
              ? `Delete @${confirm?.user?.username}? This removes the account permanently.`
              : `${confirm?.type === "ban" ? "Ban" : "Unban"} @${confirm?.user?.username}?`}
          </p>
          {confirm?.type === "ban" ? (
            <label>
              <span>Ban reason</span>
              <input value={reason} onChange={(event) => setReason(event.target.value)} />
            </label>
          ) : null}
        </div>
      </Modal>
    </>
  );
}

function UserDetailDrawer({ user, messages, onClose }) {
  const userMessages = user ? messages.filter((message) => message.authorId === user.id) : [];
  const roomHistory = [...new Set(userMessages.map((message) => message.roomId))];

  return (
    <Drawer open={Boolean(user)} title={user?.username || "User"} onClose={onClose}>
      {user ? (
        <div className="drawer-stack">
          <UserCell user={user} />
          <div className="detail-grid">
            <div><span>Email</span><strong>{user.email || "No email"}</strong></div>
            <div><span>Campus</span><strong>{user.campus || "Not set"}</strong></div>
            <div><span>Joined</span><strong>{relativeTime(user.createdAt)}</strong></div>
            <div><span>Messages</span><strong>{userMessages.length}</strong></div>
          </div>
          <section className="drawer-section">
            <h3>Room History</h3>
            <div className="badge-row">
              {roomHistory.map((roomId) => <Badge key={roomId} tone="purple">{roomId}</Badge>)}
              {!roomHistory.length ? <Badge tone="gray">No room history</Badge> : null}
            </div>
          </section>
          <section className="drawer-section">
            <h3>Profile</h3>
            <p>{user.about || "No public bio has been added."}</p>
          </section>
        </div>
      ) : null}
    </Drawer>
  );
}
