
import { db } from "@/lib/database";
import type { Expense } from "@/types/expense";
import type { ReceiptExtraction } from "@/lib/ollama";

export async function getExpenses(): Promise<Expense[]> {
  return db.expenses.orderBy("createdAt").reverse().toArray();
}

export async function createExpense(
  data: ReceiptExtraction,
  receiptImage: Blob,
): Promise<Expense> {
  const now = new Date().toISOString();

  const expense: Expense = {
    ...data,
    id: crypto.randomUUID(),
    receiptImage,
    createdAt: now,
    updatedAt: now,
    reviewStatus: "reviewed",
  };

  await db.expenses.add(expense);
  return expense;
}

export async function updateExpense(
  id: string,
  data: ReceiptExtraction,
): Promise<void> {
  const existing = await db.expenses.get(id);

  if (!existing) {
    throw new Error("This expense no longer exists.");
  }

  await db.expenses.update(id, {
    ...data,
    updatedAt: new Date().toISOString(),
    reviewStatus: "reviewed",
  });
}

export async function deleteExpense(id: string): Promise<void> {
  await db.expenses.delete(id);
}
