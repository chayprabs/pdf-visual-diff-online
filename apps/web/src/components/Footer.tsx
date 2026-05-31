import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-[var(--surface)] py-8">
      <div className="mx-auto flex max-w-5xl flex-wrap justify-center gap-x-8 gap-y-2 px-4 text-sm text-[var(--muted)]">
        <Link href="/privacy" className="hover:text-[var(--foreground)] hover:underline">
          Privacy Policy
        </Link>
        <Link href="/terms" className="hover:text-[var(--foreground)] hover:underline">
          Terms of Service
        </Link>
        <Link href="/license" className="hover:text-[var(--foreground)] hover:underline">
          License &amp; Disclaimer
        </Link>
      </div>
    </footer>
  );
}
