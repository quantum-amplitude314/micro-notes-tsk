"use client";

import { Button } from "@/components/ui/button";

export default function ErrorPage({
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <main className="page-shell flex flex-1 flex-col items-start justify-center gap-4 py-16">
      <h1 className="page-heading">Something went wrong</h1>
      <p className="text-muted-foreground">Your notes could not be loaded. Please try again.</p>
      <Button onClick={retry}>Try again</Button>
    </main>
  );
}
