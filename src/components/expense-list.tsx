
"use client";

import type { Expense } from "@/types/expense";
import {
  Download,
  Pencil,
  ReceiptText,
  Trash2,
} from "lucide-react";

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
  onExport: () => void;
}

function formatAmount(expense: Expense) {
  if (expense.total === null) return "Amount unavailable";

  try {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: expense.currency ?? "PHP",
    }).format(expense.total);
  } catch {
    return `${expense.currency ?? ""} ${expense.total.toFixed(2)}`;
  }
}

export function ExpenseList({
  expenses,
  onEdit,
  onDelete,
  onExport,
}: ExpenseListProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col justify-between gap-3 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:px-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Saved expenses
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {expenses.length} {expenses.length === 1 ? "record" : "records"} stored locally
          </p>
        </div>

        <button
          type="button"
          onClick={onExport}
          disabled={expenses.length === 0}
          className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Download size={16} />
          Export CSV
        </button>
      </div>

      {expenses.length === 0 ? (
        <div className="flex flex-col items-center px-5 py-12 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
            <ReceiptText size={26} />
          </span>
          <h3 className="mt-4 font-medium text-slate-800">
            No expenses yet
          </h3>
          <p className="mt-1 max-w-sm text-sm text-slate-500">
            Upload your first receipt to start building your expense records.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">Merchant</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 text-right font-medium">Amount</th>
                <th className="px-5 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {expenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-slate-50/70">
                  <td className="whitespace-nowrap px-5 py-4">
                    <div className="font-medium text-slate-900">
                      {expense.merchant || "Unknown merchant"}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      {expense.reviewStatus === "reviewed"
                        ? "Reviewed"
                        : "Needs review"}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                    {expense.date || "—"}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4">
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-700">
                      {expense.category}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-right font-medium text-slate-900">
                    {formatAmount(expense)}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        aria-label={`Edit ${expense.merchant || "expense"}`}
                        onClick={() => onEdit(expense)}
                        className="rounded-lg p-2 text-slate-500 hover:bg-emerald-50 hover:text-emerald-700"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        aria-label={`Delete ${expense.merchant || "expense"}`}
                        onClick={() => onDelete(expense.id)}
                        className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
