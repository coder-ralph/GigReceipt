
"use client";

import { useRef } from "react";
import { FileImage, LoaderCircle, Upload } from "lucide-react";

interface ReceiptUploaderProps {
  file: File | null;
  busy: boolean;
  onFile: (file: File | null) => void;
  onExtract: () => void;
}

export function ReceiptUploader({
  file,
  busy,
  onFile,
  onExtract,
}: ReceiptUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(nextFile?: File) {
    if (!nextFile) return;

    const allowed = ["image/jpeg", "image/png", "image/webp"];

    if (!allowed.includes(nextFile.type)) {
      onFile(null);
      window.alert("Please choose a JPEG, PNG, or WebP image.");
      return;
    }

    if (nextFile.size > 10 * 1024 * 1024) {
      onFile(null);
      window.alert("Please choose an image smaller than 10 MB.");
      return;
    }

    onFile(nextFile);
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-900">
          Scan a receipt
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Upload an image and extract its expense details using local AI.
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(event) => handleFile(event.target.files?.[0])}
      />

      <button
        type="button"
        disabled={busy}
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          handleFile(event.dataTransfer.files[0]);
        }}
        className="flex min-h-44 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center transition hover:border-emerald-500 hover:bg-emerald-50/50 disabled:opacity-60"
      >
        <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm">
          {file ? <FileImage size={24} /> : <Upload size={24} />}
        </span>
        <span className="font-medium text-slate-800">
          {file ? file.name : "Choose a receipt image"}
        </span>
        <span className="mt-2 text-sm text-slate-500">
          Click to browse or drag and drop · Max 10 MB
        </span>
      </button>

      <button
        type="button"
        onClick={onExtract}
        disabled={!file || busy}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {busy ? (
          <>
            <LoaderCircle className="animate-spin" size={18} />
            Extracting receipt...
          </>
        ) : (
          "Extract details"
        )}
      </button>
    </section>
  );
}
