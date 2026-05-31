import { Github, Globe } from "lucide-react";
import Link from "next/link";

const GITHUB_URL = "https://github.com/chayprabs/pdf-visual-diff-online";
const TWITTER_URL = "https://x.com/chayprabs";
const WEBSITE_URL = "https://www.chaitanyaprabuddha.com";

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function TopBar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-lg font-semibold tracking-tight text-[var(--foreground)]">
          PdfDiff
        </Link>
        <nav className="flex items-center gap-4" aria-label="External links">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--muted)] transition hover:text-[var(--foreground)]"
            aria-label="GitHub repository"
          >
            <Github className="h-5 w-5" />
          </a>
          <a
            href={TWITTER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--muted)] transition hover:text-[var(--foreground)]"
            aria-label="Twitter / X"
          >
            <XIcon className="h-5 w-5" />
          </a>
          <a
            href={WEBSITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--muted)] transition hover:text-[var(--foreground)]"
            aria-label="Personal website"
          >
            <Globe className="h-5 w-5" />
          </a>
        </nav>
      </div>
    </header>
  );
}
