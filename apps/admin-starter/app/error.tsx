"use client";

import { Button } from "@evenkit/ui";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="starter-not-found"><h1>This page could not be opened</h1><p>Try loading it again. Your demo changes may still be available.</p><Button onClick={reset}>Retry page</Button></main>;
}
