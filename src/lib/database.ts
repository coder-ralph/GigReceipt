
import Dexie, { type EntityTable } from "dexie";
import type { Expense } from "@/types/expense";

class GigReceiptDatabase extends Dexie {
  expenses!: EntityTable<Expense, "id">;

  constructor() {
    super("GigReceiptDatabase");

    this.version(1).stores({
      expenses: "id, date, merchant, category, reviewStatus, createdAt",
    });
  }
}

export const db = new GigReceiptDatabase();
