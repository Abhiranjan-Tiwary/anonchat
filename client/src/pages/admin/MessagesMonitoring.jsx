import { useMemo, useState } from "react";
import { useAuthStore } from "../../store/authStore.js";
import Badge from "../../components/Badge.jsx";
import Table from "../../components/Table.jsx";
import { Card, CardHeader } from "../../components/Card.jsx";
import { useAdminStore } from "../../store/adminStore.js";
import { useToast } from "../../hooks/useToast.js";
import { relativeTime, truncate } from "../../lib/utils.js";
import { UserCell } from "./pageUtils.jsx";

export default function AdminMessagesMonitoring() {
  const token = useAuthStore((state) => state.token);
  const { messages, rooms, flagMessage, deleteMessage } = useAdminStore();
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const roomNames = new Map(rooms.map((room) => [room.id, room.name]));
  const filtered = useMemo(() => messages.filter((message) => {
    const haystack = `${message.text} ${message.userName} ${message.roomId}`.toLowerCase();
    return haystack.includes(query.toLowerCase());
  }).slice(-80).reverse(), [messages, query]);

  async function handleFlag(messageId) {
    await flagMessage(token, messageId, "flag");
    toast("Message flagged.", "success");
  }

  async function handleDelete(messageId) {
    await deleteMessage(token, messageId);
    toast("Message deleted.", "success");
  }

  const rows = filtered.map((message) => ({
    id: message.id,
    cells: [
      <UserCell user={{ fullName: message.userName || "Anonymous User", username: message.authorId || "anon" }} />,
      <span>{roomNames.get(message.roomId) || message.roomId}</span>,
      <span>{truncate(message.text || message.attachment?.name || "Media message", 84)}</span>,
      <span className="mono">{relativeTime(message.createdAt)}</span>,
      <Badge tone={message.hidden ? "red" : message.reported ? "amber" : "green"}>{message.hidden ? "hidden" : message.reported ? "flagged" : "visible"}</Badge>,
      <div className="row-actions">
        <button className="message-action flag" type="button" onClick={() => handleFlag(message.id)}>Flag</button>
        <button className="message-action delete" type="button" onClick={() => handleDelete(message.id)}>Delete</button>
      </div>,
    ],
  }));

  return (
    <Card>
      <CardHeader title="Messages Monitoring" subtitle="Live message feed with room and user search." action={<input placeholder="Search messages" value={query} onChange={(event) => setQuery(event.target.value)} />} />
      <Table columns={["User", "Room", "Message", "Time", "Status", "Actions"]} rows={rows} emptyTitle="No messages found" />
    </Card>
  );
}
