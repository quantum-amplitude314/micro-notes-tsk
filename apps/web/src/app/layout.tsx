import type { Metadata } from "next";
import { Fraunces, Noto_Sans } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";
import { cn } from "@/lib/utils";

const fraunces = Fraunces({ subsets: ["latin", "latin-ext"], variable: "--font-fraunces" });
const notoSans = Noto_Sans({ subsets: ["latin", "latin-ext"], variable: "--font-noto-sans" });

export const metadata: Metadata = {
  title: "Notes",
  description: "Write notes and sort them by priority.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={cn("h-full antialiased", notoSans.variable, fraunces.variable)}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
