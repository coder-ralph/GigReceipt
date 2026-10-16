
import {
  receiptExtractionSchema,
  type ReceiptData,
} from "@/lib/receipt-schema";

export type ReceiptExtraction = ReceiptData & {
  needsReview: boolean;
};

export async function extractReceipt(
  file: File,
): Promise<ReceiptExtraction> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/receipts/extract", {
    method: "POST",
    body: formData,
  });

  const result: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      typeof result === "object" &&
      result !== null &&
      "error" in result &&
      typeof result.error === "string"
        ? result.error
        : "Unable to extract receipt details.";

    throw new Error(message);
  }

  if (
    typeof result !== "object" ||
    result === null ||
    !("data" in result)
  ) {
    throw new Error("The server returned an invalid response.");
  }

  const parsed = receiptExtractionSchema.safeParse(result.data);

  if (!parsed.success) {
    throw new Error("The extracted receipt data failed validation.");
  }

  return parsed.data;
}
