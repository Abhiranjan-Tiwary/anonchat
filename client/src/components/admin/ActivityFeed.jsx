import { relativeTime } from "../../lib/utils.js";

export default function ActivityFeed({ items = [] }) {
  return (
    <div className="activity-feed">
      {items.slice(0, 10).map((item) => (
        <article key={item.id}>
          <span className="status-dot" />
          <div>
            <strong>{item.action || item.title || item.reason || "Platform event"}</strong>
            <small>{relativeTime(item.createdAt)}</small>
          </div>
        </article>
      ))}
      {!items.length ? (
        <div className="empty-state compact">
          <span>AF</span>
          <strong>No activity yet</strong>
          <p>New moderation events will appear here.</p>
        </div>
      ) : null}
    </div>
  );
}
