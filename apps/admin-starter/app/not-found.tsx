import Link from "next/link";

export default function NotFound() {
  return <main className="starter-not-found"><h1>Page not found</h1><p>This address does not match a page in this starter.</p><Link href="/dashboard">Go to dashboard</Link></main>;
}
