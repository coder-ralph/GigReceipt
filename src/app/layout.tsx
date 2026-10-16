
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GigReceipt — Local AI Receipt & Expense Tracker",
  description:
    "Turn receipt photos into organized expense records with local AI. Review, manage, and export your expenses while keeping your data on your device.",
  applicationName: "GigReceipt",
  keywords: [
    "GigReceipt",
    "receipt scanner",
    "expense tracker",
    "local AI",
    "freelancer bookkeeping",
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
