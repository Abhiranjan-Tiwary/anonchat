export default function AdminChart({ type = "line", title, points = [] }) {
  const values = points.length ? points : [0];
  const max = Math.max(...values, 1);

  if (type === "bar") {
    return (
      <div className="bar-chart" aria-label={title} role="img">
        {values.map((value, index) => (
          <span key={`${value}-${index}`} style={{ height: `${Math.max(12, (value / max) * 100)}%` }} />
        ))}
      </div>
    );
  }

  const step = 520 / Math.max(values.length - 1, 1);
  const coords = values.map((value, index) => `${index * step},${190 - (value / max) * 150}`).join(" ");
  const area = `${coords} 520,210 0,210`;

  return (
    <svg className="activity-chart" viewBox="0 0 520 210" role="img" aria-label={title}>
      <polygon className="chart-area" points={area} />
      <polyline className="chart-stroke" points={coords} />
    </svg>
  );
}
