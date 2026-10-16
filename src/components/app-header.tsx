
import Link from "next/link";
import { ReceiptText, ShieldCheck } from "lucide-react";

export function AppHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white">
            <ReceiptText size={22} />
          </span>
          <span>
            <span className="block text-lg font-bold tracking-tight text-slate-900">
              GigReceipt
            </span>
            <span className="block text-xs text-slate-500">
              Smart expense tracking
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-800">
          <ShieldCheck size={15} />
          <span>Local-first</span>
        </div>
      </div>
    </header>
  );
}
