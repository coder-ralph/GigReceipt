
import type { ReceiptData } from "@/lib/receipt-schema";

export type ReviewStatus = "pending" | "reviewed";

export interface Expense extends ReceiptData {
  id: string;
  receiptImage: Blob;
  createdAt: string;
  updatedAt: string;
  reviewStatus: ReviewStatus;
}
