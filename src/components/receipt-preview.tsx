
"use client";

import { useEffect, useState } from "react";
import { ImageOff } from "lucide-react";

interface ReceiptPreviewProps {
  image: Blob | null;
}

export function ReceiptPreview({ image }: ReceiptPreviewProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!image) return;

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setPreviewUrl(reader.result);
      }
    };

    reader.onerror = () => {
      setPreviewUrl(null);
    };

    reader.readAsDataURL(image);

    return () => reader.abort();
  }, [image]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="mb-4 text-lg font-semibold text-slate-900">
        Receipt preview
      </h2>

      {image && previewUrl ? (
        <div className="flex min-h-48 items-center justify-center overflow-hidden rounded-xl bg-slate-50 p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="Uploaded receipt"
            className="max-h-[360px] w-auto max-w-full rounded-lg object-contain"
          />
        </div>
      ) : (
        <div className="flex min-h-48 flex-col items-center justify-center rounded-xl bg-slate-50 text-slate-400">
          <ImageOff size={32} strokeWidth={1.5} />
          <p className="mt-3 text-sm">
            {image ? "Loading receipt preview..." : "Your receipt will appear here."}
          </p>
        </div>
      )}
    </section>
  );
}
