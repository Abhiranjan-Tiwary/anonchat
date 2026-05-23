import Avatar from "../../components/ui/Avatar.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Button from "../../components/ui/Button.jsx";
import { formatNumber, relativeTime, truncate } from "../../lib/utils.js";

export function StatCard({ title, value, delta, tone = "green" }) {
  return (
    <article className="stat-card">
      <span>{title}</span>
      <strong>{formatNumber(value)}</strong>
      {delta ? <small className={`delta-${tone}`}>{delta}</small> : null}
    </article>
  );
}

export function UserCell({ user }) {
  return (
    <div className="table-user">
      <Avatar name={user.fullName || user.username || "Anonymous"} src={user.avatarDataUrl} />
      <div>
        <strong>{user.fullName || user.name || "Anonymous User"}</strong>
        <small>@{user.username || "anonymous"}</small>
      </div>
    </div>
  );
}

export function reportRows(reports, onAction) {
  return reports.map((report) => ({
    id: report.id,
    cells: [
      <UserCell user={{ fullName: report.message?.userName || "Anonymous User", username: report.message?.authorId || "anon" }} />,
      <div><strong>{report.reason || "Report"}</strong><small>{truncate(report.message?.text || "Reported message unavailable", 70)}</small></div>,
      <Badge tone={report.status === "open" ? "amber" : report.status === "hidden" ? "purple" : "green"}>{report.status || "open"}</Badge>,
      <span className="mono">{relativeTime(report.createdAt)}</span>,
      <div className="row-actions">
        <Button size="sm" variant="ghost" onClick={() => onAction(report.id, "hide")}>Hide</Button>
        <Button size="sm" variant="ghost" onClick={() => onAction(report.id, "dismiss")}>Dismiss</Button>
      </div>,
    ],
  }));
}
