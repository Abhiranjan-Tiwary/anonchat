export function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function formatNumber(value) {
  return new Intl.NumberFormat("en", { notation: Number(value) > 9999 ? "compact" : "standard" }).format(Number(value || 0));
}

export function relativeTime(timestamp) {
  const diff = Math.max(0, Date.now() - Number(timestamp || Date.now()));
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function initials(name = "AnonChat") {
  return String(name)
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function truncate(value, max = 90) {
  const text = String(value || "");
  return text.length > max ? `${text.slice(0, max - 1)}...` : text;
}
