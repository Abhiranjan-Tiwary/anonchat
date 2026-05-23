import { initials } from "../lib/utils.js";

export default function Avatar({ name, src, tone = "violet", color = "" }) {
  if (src) return <img className="avatar" src={src} alt={`${name} avatar`} />;
  const style = color ? { background: `linear-gradient(135deg, ${color}, rgba(108, 99, 255, 0.72))` } : undefined;
  return <span className={`avatar avatar-${tone}`} style={style}>{initials(name)}</span>;
}
