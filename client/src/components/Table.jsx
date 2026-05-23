import { cx } from "../lib/utils.js";

export default function Table({ columns, rows, emptyTitle = "No records found", emptyBody = "This workspace is clear." }) {
  if (!rows.length) {
    return (
      <div className="empty-state">
        <span>AC</span>
        <strong>{emptyTitle}</strong>
        <p>{emptyBody}</p>
      </div>
    );
  }

  return (
    <div className={cx("data-table", `cols-${columns.length}`)} role="table">
      <div className="table-row table-head" role="row">
        {columns.map((column) => (
          <div key={column} role="columnheader">{column}</div>
        ))}
      </div>
      {rows.map((row) => (
        <div className="table-row" role="row" key={row.id}>
          {row.cells.map((cell, index) => (
            <div role="cell" key={`${row.id}-${index}`}>{cell}</div>
          ))}
        </div>
      ))}
    </div>
  );
}
