import { cx } from "../lib/utils.js";

export default function Badge({ children, tone = "gray" }) {
  return <span className={cx("badge", `badge-${tone}`)}>{children}</span>;
}
