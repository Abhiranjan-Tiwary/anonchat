import Badge from "../../components/ui/Badge.jsx";
import { Card, CardHeader } from "../../components/ui/Card.jsx";
import Avatar from "../../components/Avatar.jsx";
import GuestUpgradeBanner from "../../components/GuestUpgradeBanner.jsx";
import { useAuthStore } from "../../store/authStore.js";
import { useNotificationStore } from "../../store/notificationStore.js";

const activityFallback = [
  { id: "like-preview", type: "LIKE", body: "People who like your future posts will appear here.", time: "Now", unread: false },
  { id: "comment-preview", type: "COMMENT", body: "Comments, mentions and follow activity will use this same activity layout.", time: "Now", unread: false },
];

export default function Notifications() {
  const user = useAuthStore((state) => state.user);
  const items = useNotificationStore((state) => state.items);
  const markAllRead = useNotificationStore((state) => state.markAllRead);
  const markRead = useNotificationStore((state) => state.markRead);
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  const activityItems = items.length ? items : activityFallback;

  if (user?.isGuest) {
    return (
      <div className="workspace-page ig-notifications-page">
        <CardHeader title="Notifications" subtitle="Create a free account to receive likes, comments, follows, mentions and announcements." />
        <GuestUpgradeBanner />
      </div>
    );
  }

  return (
    <div className="workspace-page ig-notifications-page">
      <CardHeader
        title="Notifications"
        subtitle="Likes, comments, follows, mentions and real-time system updates."
        action={
          <button className="mark-read-btn" type="button" onClick={markAllRead} disabled={!unreadCount}>
            {unreadCount ? "Mark all as read" : "All read"}
          </button>
        }
      />
      <Card className="ig-activity-card">
        <div className="ig-activity-tabs">
          <button type="button" className="active">All</button>
          <button type="button">Likes</button>
          <button type="button">Comments</button>
          <button type="button">Follows</button>
        </div>
        <div className="list-stack">
          {activityItems.map((item) => (
            <article
              className={`list-card notification-card ig-activity-row ${String(item.type).toLowerCase()} ${item.unread ? "unread" : ""}`}
              key={item.id}
              onClick={() => markRead(item.id)}
            >
              <Avatar name={item.type} />
              <div>
                <strong>{notificationTitle(item.type)}{item.unread ? <span className="unread-dot" /> : null}</strong>
                <p>{item.body}</p>
              </div>
              <Badge tone="purple">{item.time}</Badge>
            </article>
          ))}
        </div>
        <p className="notification-summary">{unreadCount} unread notification{unreadCount === 1 ? "" : "s"}</p>
      </Card>
    </div>
  );
}

function notificationTitle(type) {
  const normalized = String(type || "ACTIVITY").toUpperCase();
  if (normalized.includes("LIKE")) return "New like";
  if (normalized.includes("COMMENT")) return "New comment";
  if (normalized.includes("FOLLOW")) return "New follower";
  if (normalized.includes("MENTION")) return "New mention";
  if (normalized.includes("ANNOUNCEMENT")) return "Announcement";
  return normalized;
}
