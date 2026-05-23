import { formatNumber } from "../../lib/utils.js";

export default function StatCard({ title, value, delta, tone = "green", accent = "violet" }) {
  return (
    <article className={`stat-card accent-${accent}`}>
      <span>{title}</span>
      <strong>{formatNumber(value)}</strong>
      {delta ? <small className={`delta-${tone}`}>{delta}</small> : null}
    </article>
  );
}
