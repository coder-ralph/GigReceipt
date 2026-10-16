
import type { Expense } from "@/types/expense";

function csvCell(value: string | number | null): string {
  let text = value == null ? "" : String(value);

  // Prevent untrusted text from being interpreted as a spreadsheet formula.
  if (/^[\t\r\n ]*[=+\-@]/.test(text)) {
    text = `'${text}`;
  }

  return `"${text.replace(/"/g, '""')}"`;
}

export function exportExpensesToCsv(expenses: Expense[]): void {
  const headers = [
    "Date",
    "Merchant",
    "Category",
    "Amount",
    "Currency",
    "Payment Method",
    "Notes",
    "Review Status",
    "Created At",
  ];

  const rows = expenses.map((expense) => [
    expense.date,
    expense.merchant,
    expense.category,
    expense.total,
    expense.currency,
    expense.paymentMethod,
    expense.notes,
    expense.reviewStatus,
    expense.createdAt,
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map(csvCell).join(","))
    .join("\r\n");

  // UTF-8 BOM improves compatibility with spreadsheet applications.
  const blob = new Blob(["\uFEFF", csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = `gigreceipt-expenses-${new Date()
    .toISOString()
    .slice(0, 10)}.csv`;

  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
