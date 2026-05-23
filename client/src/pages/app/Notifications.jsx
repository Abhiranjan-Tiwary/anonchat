import Badge from "../../components/ui/Badge.jsx";
import { Card, CardHeader } from "../../components/ui/Card.jsx";
import GuestUpgradeBanner from "../../components/GuestUpgradeBanner.jsx";
import { useAuthStore } from "../../store/authStore.js";
import { useNotificationStore } from "../../store/notificationStore.js";

export default function Notifications() {
  const user = useAuthStore((state) => state.user);
  const items = useNotificationStore((state) => state.items);
  const markAllRead = useNotificationStore((state) => state.markAllRead);
  const markRead = useNotificationStore((state) => state.markRead);
  const unreadCount = useNotificationStore((state) => state.unreadCount);

  if (user?.isGuest) {
    return (
      <div className="workspace-page">
        <CardHeader title="Notifications" subtitle="Create a free account to receive system alerts, invites, and announcements." />
        <GuestUpgradeBanner />
      </div>
    );
  }

  return (
    <div className="workspace-page">
      <CardHeader
        title="Notifications"
        subtitle="System alerts, room invites, and announcements."
        action={
          <button className="mark-read-btn" type="button" onClick={markAllRead} disabled={!unreadCount}>
            {unreadCount ? "Mark all as read" : "All read"}
          </button>
        }
      />
      <Card>
        <div className="list-stack">
          {items.map((item) => (
            <article
              className={`list-card notification-card ${item.type.toLowerCase()} ${item.unread ? "unread" : ""}`}
              key={item.id}
              onClick={() => markRead(item.id)}
            >
              <div>
                <strong>{item.type}{item.unread ? <span className="unread-dot" /> : null}</strong>
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
