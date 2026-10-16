
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, LoaderCircle, Wallet } from "lucide-react";

import { AppHeader } from "@/components/app-header";
import { ReceiptUploader } from "@/components/receipt-uploader";
import { ReceiptPreview } from "@/components/receipt-preview";
import { ExpenseReviewForm } from "@/components/expense-review-form";
import { ExpenseList } from "@/components/expense-list";

import { extractReceipt, type ReceiptExtraction } from "@/lib/ollama";
import { receiptExtractionSchema } from "@/lib/receipt-schema";
import {
  createExpense,
  deleteExpense,
  getExpenses,
  updateExpense,
} from "@/lib/expenses";
import { exportExpensesToCsv } from "@/lib/export-csv";
import type { Expense } from "@/types/expense";

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<Blob | null>(null);
  const [draft, setDraft] = useState<ReceiptExtraction | null>(null);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const [loadingExpenses, setLoadingExpenses] = useState(true);
  const [extracting, setExtracting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const refreshExpenses = useCallback(async () => {
    const records = await getExpenses();
    setExpenses(records);
  }, []);

  useEffect(() => {
    let active = true;

    getExpenses()
      .then((records) => {
        if (active) setExpenses(records);
      })
      .catch(() => {
        if (active) {
          setError(
            "Could not open local expense storage. Check your browser's storage settings.",
          );
        }
      })
      .finally(() => {
        if (active) setLoadingExpenses(false);
      });

    return () => {
      active = false;
    };
  }, []);

  function handleFile(file: File | null) {
    setSelectedFile(file);
    setPreviewImage(file);
    setDraft(null);
    setEditingExpense(null);
    setError(null);
    setNotice(null);
  }

  async function handleExtract() {
    if (!selectedFile) return;

    setExtracting(true);
    setError(null);
    setNotice(null);
    setDraft(null);

    try {
      const result = await extractReceipt(selectedFile);
      setDraft(result);
      setNotice("Extraction complete. Review the fields before saving.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not extract the receipt.",
      );
    } finally {
      setExtracting(false);
    }
  }

  function handleEdit(expense: Expense) {
    setEditingExpense(expense);
    setSelectedFile(null);
    setPreviewImage(expense.receiptImage);
    setDraft({
      merchant: expense.merchant,
      date: expense.date,
      total: expense.total,
      currency: expense.currency,
      category: expense.category,
      paymentMethod: expense.paymentMethod,
      notes: expense.notes,
      needsReview: expense.reviewStatus === "pending",
    });
    setError(null);
    setNotice(null);
  }

  function handleCancel() {
    setSelectedFile(null);
    setPreviewImage(null);
    setDraft(null);
    setEditingExpense(null);
    setError(null);
    setNotice(null);
  }

  async function handleSave() {
    if (!draft) return;

    const parsed = receiptExtractionSchema.safeParse(draft);

    if (!parsed.success) {
      setError("Some fields are invalid. Check the date, amount, and currency.");
      return;
    }

    if (!editingExpense && !selectedFile) {
      setError("Upload a receipt before saving a new expense.");
      return;
    }

    setSaving(true);
    setError(null);
    setNotice(null);

    try {
      if (editingExpense) {
        await updateExpense(editingExpense.id, parsed.data);
      } else {
        await createExpense(parsed.data, selectedFile!);
      }

      await refreshExpenses();
      handleCancel();
      setNotice("Expense saved successfully on this device.");
    } catch {
      setError("Could not save the expense. Check local browser storage.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this expense and its saved receipt image?")) {
      return;
    }

    try {
      await deleteExpense(id);

      if (editingExpense?.id === id) {
        handleCancel();
      }

      await refreshExpenses();
      setNotice("Expense deleted.");
      setError(null);
    } catch {
      setError("Could not delete the expense.");
    }
  }

  const totalExpenses = useMemo(
    () => expenses.reduce((sum, expense) => sum + (expense.total ?? 0), 0),
    [expenses],
  );

  const totalCurrency = useMemo(() => {
    const currencies = new Set(
      expenses
        .filter((expense) => expense.total !== null)
        .map((expense) => expense.currency ?? "PHP"),
    );

    return currencies.size === 1 ? [...currencies][0] : null;
  }, [expenses]);

  const formattedTotal = useMemo(() => {
    if (!totalCurrency) return null;

    try {
      return new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: totalCurrency,
      }).format(totalExpenses);
    } catch {
      return `${totalCurrency} ${totalExpenses.toFixed(2)}`;
    }
  }, [totalCurrency, totalExpenses]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <AppHeader />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">
            Your finances, simplified
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Receipt to record.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Turn receipt photos into organized expenses with AI running locally
            on your computer. Review every detail before saving.
          </p>
        </div>

        {(error || notice) && (
          <div
            role={error ? "alert" : "status"}
            className={`mb-6 flex items-start gap-3 rounded-xl border p-4 text-sm ${
              error
                ? "border-red-200 bg-red-50 text-red-800"
                : "border-emerald-200 bg-emerald-50 text-emerald-900"
            }`}
          >
            {error ? (
              <AlertCircle className="mt-0.5 shrink-0" size={18} />
            ) : (
              <CheckCircle2 className="mt-0.5 shrink-0" size={18} />
            )}
            <span>{error ?? notice}</span>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <ReceiptUploader
              file={selectedFile}
              busy={extracting}
              onFile={handleFile}
              onExtract={handleExtract}
            />

            <ReceiptPreview image={previewImage} />
          </div>

          <div>
            {draft ? (
              <ExpenseReviewForm
                data={draft}
                onChange={setDraft}
                onSave={handleSave}
                onCancel={handleCancel}
                saving={saving}
                editing={Boolean(editingExpense)}
              />
            ) : (
              <section className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center">
                {extracting ? (
                  <LoaderCircle
                    className="animate-spin text-emerald-600"
                    size={32}
                  />
                ) : (
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                    <Wallet size={27} />
                  </span>
                )}

                <h2 className="mt-4 text-lg font-semibold text-slate-900">
                  {extracting ? "Reading your receipt..." : "Expense details"}
                </h2>

                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                  {extracting
                    ? "Your local AI model is analyzing the image. This may take a little while."
                    : "Choose a receipt and extract its details, or select a saved expense to edit it."}
                </p>
              </section>
            )}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Saved expenses</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {loadingExpenses ? "—" : expenses.length}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Stored in this browser
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Recorded total</p>
            <p className="mt-2 break-words text-2xl font-bold text-slate-900">
              {loadingExpenses
                ? "—"
                : formattedTotal ?? "Mixed currencies"}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {formattedTotal
                ? "Sum of saved amounts in one currency"
                : "Totals across different currencies are not combined"}
            </p>
          </section>
        </div>

        <div className="mt-8">
          {loadingExpenses ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
              Loading your local expenses...
            </div>
          ) : (
            <ExpenseList
              expenses={expenses}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onExport={() => exportExpensesToCsv(expenses)}
            />
          )}
        </div>

        <footer className="mt-10 border-t border-slate-200 py-6 text-center text-xs text-slate-500">
          GigReceipt · Local AI, private records.
        </footer>
      </main>
    </div>
  );
}
