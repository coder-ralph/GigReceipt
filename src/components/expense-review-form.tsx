
"use client";

import { EXPENSE_CATEGORIES } from "@/lib/receipt-schema";
import type { ReceiptExtraction } from "@/lib/ollama";
import { Save, X } from "lucide-react";

interface ExpenseReviewFormProps {
  data: ReceiptExtraction;
  onChange: (data: ReceiptExtraction) => void;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
  editing: boolean;
}

export function ExpenseReviewForm({
  data,
  onChange,
  onSave,
  onCancel,
  saving,
  editing,
}: ExpenseReviewFormProps) {
  function update<K extends keyof ReceiptExtraction>(
    key: K,
    value: ReceiptExtraction[K],
  ) {
    onChange({ ...data, [key]: value });
  }

  const fieldClass =
    "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-900">
          {editing ? "Edit expense" : "Review extracted details"}
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Verify the values before saving. AI extraction may contain errors.
        </p>
      </div>

      {data.needsReview && (
        <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          Some fields may be uncertain. Please double-check the receipt.
        </div>
      )}

      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          onSave();
        }}
      >
        <div>
          <label className="text-sm font-medium text-slate-700">
            Merchant
          </label>
          <input
            className={fieldClass}
            maxLength={200}
            value={data.merchant ?? ""}
            onChange={(e) => update("merchant", e.target.value || null)}
            placeholder="Merchant or store name"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-slate-700">
              Transaction date
            </label>
            <input
              type="date"
              className={fieldClass}
              value={data.date ?? ""}
              onChange={(e) => update("date", e.target.value || null)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Category
            </label>
            <select
              className={fieldClass}
              value={data.category}
              onChange={(e) =>
                update(
                  "category",
                  e.target.value as ReceiptExtraction["category"],
                )
              }
            >
              {EXPENSE_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-700">
              Total amount
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              className={fieldClass}
              value={data.total ?? ""}
              onChange={(e) =>
                update(
                  "total",
                  e.target.value === "" ? null : Number(e.target.value),
                )
              }
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Currency
            </label>
            <input
              className={fieldClass}
              maxLength={3}
              value={data.currency ?? ""}
              onChange={(e) =>
                update("currency", e.target.value.toUpperCase() || null)
              }
              placeholder="PHP"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">
            Payment method
          </label>
          <input
            className={fieldClass}
            maxLength={100}
            value={data.paymentMethod ?? ""}
            onChange={(e) =>
              update("paymentMethod", e.target.value || null)
            }
            placeholder="Cash, card, e-wallet..."
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">
            Notes
          </label>
          <textarea
            className={fieldClass}
            rows={3}
            maxLength={1000}
            value={data.notes ?? ""}
            onChange={(e) => update("notes", e.target.value || null)}
            placeholder="Optional notes"
          />
        </div>

        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
          <button
            type="submit"
            disabled={saving}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            <Save size={17} />
            {saving ? "Saving..." : "Save expense"}
          </button>

          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-3 font-medium text-slate-700 hover:bg-slate-50"
          >
            <X size={17} />
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}
