import type { Metadata } from "next";
import { Fraunces, Noto_Sans } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import "../globals.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const fraunces = Fraunces({ subsets: ["latin", "latin-ext"], variable: "--font-fraunces" });
const notoSans = Noto_Sans({ subsets: ["latin", "latin-ext"], variable: "--font-noto-sans" });

export const generateStaticParams = () => routing.locales.map((locale) => ({ locale }));

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations("metadata");
  const metadata: Metadata = { title: t("title"), description: t("description") };

  return metadata;
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  return (
    <html lang={locale} className={cn("h-full antialiased", notoSans.variable, fraunces.variable)}>
      <body className="flex min-h-full flex-col">
        <NextIntlClientProvider>
          <SiteHeader />
          {children}
          <SiteFooter />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
