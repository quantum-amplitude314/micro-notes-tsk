import type { ReactNode } from "react";

export function AuthPage({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <main className="page-shell flex flex-1 flex-col justify-center py-16">
      <div className="mx-auto flex w-full max-w-sm flex-col gap-8 rounded-xl border bg-card p-8 shadow-sm">
        <div className="flex flex-col gap-1">
          <p className="font-heading text-lg font-medium text-muted-foreground">Notes</p>
          <h1 className="page-heading">{heading}</h1>
        </div>
        {children}
      </div>
    </main>
  );
}
