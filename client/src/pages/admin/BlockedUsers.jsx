import Button from "../../components/Button.jsx";
import Table from "../../components/Table.jsx";
import { Card, CardHeader } from "../../components/Card.jsx";
import { useAuthStore } from "../../store/authStore.js";
import { useAdminStore } from "../../store/adminStore.js";
import { useToast } from "../../hooks/useToast.js";
import { relativeTime } from "../../lib/utils.js";
import { UserCell } from "./pageUtils.jsx";

export default function AdminBlockedUsers() {
  const token = useAuthStore((state) => state.token);
  const { users, updateUserStatus } = useAdminStore();
  const { toast } = useToast();
  const blocked = users.filter((user) => user.status === "suspended");

  async function unblock(user) {
    await updateUserStatus(token, user.id, "active");
    toast("User unblocked.", "success");
  }

  const rows = blocked.map((user) => ({
    id: user.id,
    cells: [
      <UserCell user={user} />,
      <span>{user.suspensionReason || "Community safety"}</span>,
      <span className="mono">{relativeTime(user.updatedAt || user.lastSeen || Date.now())}</span>,
      <Button size="sm" variant="ghost" onClick={() => unblock(user)}>Unblock</Button>,
    ],
  }));

  return (
    <Card>
      <CardHeader title="Blocked Users" subtitle="Review suspended accounts, reason, duration, and unblock when safe." />
      <Table columns={["User", "Reason", "Blocked Since", "Action"]} rows={rows} emptyTitle="No blocked users" />
    </Card>
  );
}
