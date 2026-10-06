// Shared, formula-safe CSV builder for every admin export.
// Text that a spreadsheet would treat as a formula (starting with = + - @,
// tab or carriage return) is prefixed with an apostrophe so Excel/Google Sheets
// show it as plain text. Real numbers stay numeric; dates/other text unchanged.

const FORMULA_START = /^[=+\-@\t\r]/;

export function safeCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "number" || typeof value === "bigint") return String(value);
  if (typeof value === "boolean") return value ? "true" : "false";
  let s = Array.isArray(value) ? value.join("; ") : value instanceof Date ? value.toISOString() : String(value);
  // Numeric strings like "-10" or "+5" are legitimate numbers, not formulas.
  if (FORMULA_START.test(s) && !/^[+-]?\d+(\.\d+)?$/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

export function toSafeCsv(rows: unknown[][]): string {
  return rows.map((r) => r.map(safeCell).join(",")).join("\r\n");
}

export function downloadSafeCsv(filename: string, rows: unknown[][]) {
  const blob = new Blob(["\uFEFF" + toSafeCsv(rows)], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
