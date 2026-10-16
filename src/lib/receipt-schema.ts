
import { z } from "zod";

export const EXPENSE_CATEGORIES = [
  "Fuel",
  "Transportation",
  "Meals",
  "Supplies",
  "Equipment",
  "Utilities",
  "Maintenance",
  "Healthcare",
  "Shopping",
  "Other",
] as const;

export const receiptSchema = z.object({
  merchant: z.string().trim().max(200).nullable(),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .nullable(),
  total: z.number().finite().nonnegative().nullable(),
  currency: z
    .string()
    .regex(/^[A-Z]{3}$/)
    .nullable(),
  category: z.enum(EXPENSE_CATEGORIES),
  paymentMethod: z.string().trim().max(100).nullable(),
  notes: z.string().trim().max(1000).nullable(),
});

export type ReceiptData = z.infer<typeof receiptSchema>;

export const receiptExtractionSchema = receiptSchema.extend({
  // Extraction may be incomplete. Users must review uncertain fields.
  needsReview: z.boolean(),
});
