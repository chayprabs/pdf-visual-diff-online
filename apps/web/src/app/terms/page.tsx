import { Footer } from "@/components/Footer";
import { LegalProse } from "@/components/LegalProse";
import { TopBar } from "@/components/TopBar";
import { termsMeta, termsSections } from "@/content/legal/terms-sections";
import Link from "next/link";

export const metadata = {
  title: termsMeta.title,
  description:
    "Terms of Service for PdfDiff: acceptable use, disclaimers, limitation of liability, indemnification, and dispute resolution.",
};

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <TopBar />
      <article className="mx-auto max-w-3xl flex-1 px-4 py-12 sm:px-6">
        <h1 className="text-2xl font-semibold">Terms of Service</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">Last updated: {termsMeta.lastUpdated}</p>
        <p className="mt-4 text-sm leading-relaxed">
          By using PdfDiff you agree to these Terms. Operator: <strong>Chaitanya Prabuddha</strong>.
          Canonical copy:{" "}
          <a
            href="https://github.com/chayprabs/pdf-visual-diff-online/blob/main/legal/terms.md"
            className="text-[var(--accent)] hover:underline"
            rel="noopener noreferrer"
            target="_blank"
          >
            legal/terms.md
          </a>
          .
        </p>
        <LegalProse sections={termsSections} />
        <Link href="/" className="mt-10 inline-block text-sm text-[var(--accent)] hover:underline">
          ← Back to PdfDiff
        </Link>
      </article>
      <Footer />
    </div>
  );
}
