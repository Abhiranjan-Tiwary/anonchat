import { Link } from "react-router-dom";
import { useAdminStore } from "../../store/adminStore.js";
import { relativeTime } from "../../lib/utils.js";

export default function AdminDashboard() {
  const { users, rooms, reports, messages, auditLogs, stats } = useAdminStore();
  const activeRooms = rooms.filter((room) => !room.hidden).length;
  const pendingReports = reports.filter((report) => report.status === "open").length;
  const todayMessages = messages.filter((message) => isToday(message.createdAt)).length;
  const onlineUsers = Number(stats.online || 0);
  const visibleUsers = users.slice(0, 4);
  const visibleRooms = rooms
    .map((room, index) => ({
      ...room,
      category: room.category || room.desc || "Public Room",
      messageCount: Number(room.messageCount ?? messages.filter((message) => message.roomId === room.id).length),
      tone: room.tone || toneForIndex(index),
    }))
    .sort((first, second) => Number(second.messageCount || 0) - Number(first.messageCount || 0))
    .slice(0, 4);
  const activity = createActivity(auditLogs, reports, messages, users);
  const messageSeries = createDailySeries(messages, 7);
  const chart = createLineChart(messageSeries.map((item) => item.count));

  return (
    <>
      <div className="adm-page-hd">
        <div className="adm-page-title">Dashboard</div>
        <div className="adm-page-sub">Live platform overview from your AnonChat backend.</div>
      </div>

      <div className="adm-stat-grid">
        <Stat tone="v" label="Total Users" value={formatNumber(users.length || stats.users || 0)} trend={`${formatNumber(onlineUsers)} online now`} trendTone="up" icon="US" />
        <Stat tone="g" label="Active Rooms" value={formatNumber(activeRooms)} trend={`${formatNumber(rooms.length)} total rooms`} trendTone="up" icon="CR" />
        <Stat tone="a" label="Messages Today" value={formatNumber(todayMessages)} trend={`${formatNumber(messages.length)} total messages`} trendTone="up" icon="MS" />
        <Stat tone="r" label="Reports Pending" value={formatNumber(pendingReports)} trend={`${formatNumber(reports.length)} total reports`} trendTone={pendingReports ? "dn" : "up"} icon="RP" />
      </div>

      <div className="adm-grid-2">
        <section className="adm-card">
          <div className="adm-card-hd">
            <span className="adm-card-title">Messages Activity</span>
            <span className="adm-card-action">Last 7 days</span>
          </div>
          <div className="adm-chart-wrap">
            <svg viewBox="0 0 480 130" width="100%" aria-label="Messages activity chart">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6c63ff" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#6c63ff" stopOpacity="0" />
                </linearGradient>
              </defs>
              <line className="chart-grid-line" x1="0" y1="100" x2="480" y2="100" />
              <line className="chart-grid-line" x1="0" y1="65" x2="480" y2="65" />
              <line className="chart-grid-line" x1="0" y1="30" x2="480" y2="30" />
              <polygon className="chart-area" points={chart.areaPoints} />
              <polyline className="chart-line-path" points={chart.linePoints} />
              {chart.dots.map(({ cx, cy }, index) => (
                <circle className="chart-dot" cx={cx} cy={cy} r={index === chart.dots.length - 1 ? "4" : "3"} key={`${cx}-${cy}`} />
              ))}
            </svg>
            <div className="adm-chart-labels">
              {messageSeries.map((item) => <span key={item.label}>{item.label}</span>)}
            </div>
          </div>
        </section>

        <section className="adm-card">
          <div className="adm-card-hd">
            <span className="adm-card-title">Recent Activity</span>
            <Link className="adm-card-action" to="/admin/reports">View all</Link>
          </div>
          <div className="adm-card-body">
            {activity.length ? (
              <ul className="adm-feed">
                {activity.slice(0, 5).map((item) => (
                  <li className="adm-feed-item" key={item.id}>
                    <div className={`adm-feed-dot ${item.tone}`} />
                    <div>
                      <div className="adm-feed-text">{item.text}</div>
                      <div className="adm-feed-time">{item.time}</div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="empty-state compact"><span>AC</span><strong>No activity yet</strong><p>New users, reports, messages, and admin actions will appear here live.</p></div>
            )}
          </div>
        </section>
      </div>

      <div className="adm-grid-3">
        <section className="adm-card adm-span-2">
          <div className="adm-card-hd">
            <span className="adm-card-title">Recent Users</span>
            <Link className="adm-card-action" to="/admin/users">View all users</Link>
          </div>
          <div className="adm-table-scroll">
            {visibleUsers.length ? (
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Campus</th>
                    <th>Joined</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleUsers.map((user, index) => (
                    <tr key={user.id || user.username || index}>
                      <td>
                        <div className="adm-av-cell">
                          <div className={`adm-av ${user.tone || toneForIndex(index)}`}>{initials(user)}</div>
                          <div>
                            <div className="adm-cell-name">{user.anonymousName || user.username || "Anonymous User"}</div>
                            <div className="adm-cell-sub">{user.email || "No email"}</div>
                          </div>
                        </div>
                      </td>
                      <td><div className="adm-cell-name">{user.campus || "Not set"}</div><div className="adm-cell-sub">{user.department || "Not set"}</div></td>
                      <td className="adm-mono-cell">{relativeTime(user.createdAt)}</td>
                      <td><StatusBadge status={user.status} /></td>
                      <td><Link className="adm-row-action" to="/admin/users">View</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-state compact"><span>US</span><strong>No users yet</strong><p>Registered users will appear here as soon as they sign up.</p></div>
            )}
          </div>
        </section>

        <aside className="adm-side-stack">
          <section className="adm-card">
            <div className="adm-card-hd">
              <span className="adm-card-title">System Health</span>
              <span className="adm-badge green">Live</span>
            </div>
            <div className="adm-card-body">
              <div className="adm-sys-row"><span className="adm-sys-label">Backend</span><span className="adm-sys-val success">Connected</span></div>
              <div className="adm-sys-row"><span className="adm-sys-label">Users in DB</span><span className="adm-sys-val">{formatNumber(users.length || stats.users || 0)}</span></div>
              <div className="adm-sys-row"><span className="adm-sys-label">Rooms</span><span className="adm-sys-val">{formatNumber(rooms.length)}</span></div>
              <div className="adm-sys-row"><span className="adm-sys-label">Messages</span><span className="adm-sys-val">{formatNumber(messages.length)}</span></div>
              <div className="adm-sys-row"><span className="adm-sys-label">Open Reports</span><span className="adm-sys-val">{formatNumber(pendingReports)}</span></div>
            </div>
          </section>

          <section className="adm-card">
            <div className="adm-card-hd">
              <span className="adm-card-title">Top Rooms</span>
              <Link className="adm-card-action" to="/admin/chat-rooms">All rooms</Link>
            </div>
            <div className="adm-card-body">
              {visibleRooms.length ? (
                visibleRooms.map((room, index) => (
                  <div className="adm-room-row" key={room.id || room.name}>
                    <div className={`adm-room-icon ${room.tone || toneForIndex(index)}`}>{room.icon || room.name?.slice(0, 2).toUpperCase() || "#"}</div>
                    <div><div className="adm-room-name">{room.name}</div><div className="adm-room-cat">{room.category || "Public Room"}</div></div>
                    <div className="adm-room-msgs">{formatNumber(room.messageCount || 0)}</div>
                  </div>
                ))
              ) : (
                <div className="empty-state compact"><span>CR</span><strong>No rooms yet</strong><p>Create rooms to see activity rankings.</p></div>
              )}
            </div>
          </section>
        </aside>
      </div>
    </>
  );
}

function Stat({ tone, label, value, trend, trendTone, icon }) {
  return (
    <section className={`adm-stat ${tone}`}>
      <div className="adm-stat-label">{label}</div>
      <div className="adm-stat-val">{value}</div>
      <div className={`adm-stat-trend ${trendTone}`}>{trend}</div>
      <div className="adm-stat-icon">{icon}</div>
    </section>
  );
}

function StatusBadge({ status }) {
  const suspended = status === "suspended";
  const pending = status === "pending";
  return <span className={`adm-badge ${suspended ? "red" : pending ? "amber" : "green"}`}>{suspended ? "Suspended" : pending ? "Pending" : "Active"}</span>;
}

function createActivity(auditLogs, reports, messages, users) {
  const logs = auditLogs.slice(0, 5).map((log, index) => ({
    id: log.id || `audit-${index}`,
    tone: toneForIndex(index),
    createdAt: Number(log.createdAt || 0),
    text: <><strong>{log.adminName || "Admin"}</strong> ran {String(log.action || "moderation action").replaceAll(":", " ")}</>,
    time: relativeTime(log.createdAt),
  }));

  const reportItems = reports.slice(0, 5).map((report, index) => ({
    id: report.id || `report-${index}`,
    tone: report.status === "open" ? "red" : "green",
    createdAt: Number(report.createdAt || 0),
    text: <>Report opened for <strong>{report.reason || "community safety"}</strong></>,
    time: relativeTime(report.createdAt),
  }));

  const messageItems = messages.slice(-5).map((message, index) => ({
    id: message.id || `message-${index}`,
    tone: "blue",
    createdAt: Number(message.createdAt || 0),
    text: <>New message in <strong>{message.roomId || "room"}</strong></>,
    time: relativeTime(message.createdAt),
  }));

  const userItems = users.slice(0, 5).map((user, index) => ({
    id: user.id || `user-${index}`,
    tone: "green",
    createdAt: Number(user.createdAt || 0),
    text: <><strong>{user.username || user.anonymousName || "User"}</strong> joined AnonChat</>,
    time: relativeTime(user.createdAt),
  }));

  return [...logs, ...reportItems, ...messageItems, ...userItems]
    .filter((item) => item.createdAt)
    .sort((first, second) => second.createdAt - first.createdAt);
}

function createDailySeries(messages, days) {
  const today = new Date();
  return Array.from({ length: days }, (_, index) => {
    const date = new Date(today);
    date.setHours(0, 0, 0, 0);
    date.setDate(today.getDate() - (days - 1 - index));
    const next = new Date(date);
    next.setDate(date.getDate() + 1);
    const count = messages.filter((message) => {
      const createdAt = Number(message.createdAt || 0);
      return createdAt >= date.getTime() && createdAt < next.getTime();
    }).length;

    return {
      label: date.toLocaleDateString("en-US", { weekday: "short" }),
      count,
    };
  });
}

function createLineChart(values) {
  const width = 480;
  const top = 30;
  const bottom = 100;
  const max = Math.max(1, ...values);
  const step = values.length > 1 ? width / (values.length - 1) : width;
  const dots = values.map((value, index) => {
    const cx = Math.round(index * step);
    const cy = Math.round(bottom - (value / max) * (bottom - top));
    return { cx, cy };
  });
  const linePoints = dots.map((point) => `${point.cx},${point.cy}`).join(" ");
  const areaPoints = `${linePoints} ${width},130 0,130`;
  return { dots, linePoints, areaPoints };
}

function initials(user) {
  const source = user.anonymousName || user.username || user.fullName || "AU";
  const words = String(source).replace("#", " ").split(/\s+/).filter(Boolean);
  return words.length > 1 ? `${words[0][0]}${words[1][0]}`.toUpperCase() : source.slice(0, 2).toUpperCase();
}

function toneForIndex(index) {
  return ["violet", "red", "green", "amber", "blue", "purple"][index % 6];
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(Number(value || 0));
}

function isToday(timestamp) {
  return new Date(Number(timestamp || 0)).toDateString() === new Date().toDateString();
}
