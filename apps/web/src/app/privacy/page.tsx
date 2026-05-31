import { Footer } from "@/components/Footer";
import { LegalProse } from "@/components/LegalProse";
import { TopBar } from "@/components/TopBar";
import { privacyMeta, privacySections } from "@/content/legal/privacy-sections";
import Link from "next/link";

export const metadata = {
  title: privacyMeta.title,
  description:
    "How PdfDiff handles uploads, retention, privacy rights (GDPR, CCPA), and your responsibilities.",
};

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <TopBar />
      <article className="prose prose-neutral mx-auto max-w-3xl flex-1 px-4 py-12 sm:px-6">
        <h1 className="text-2xl font-semibold">Privacy Policy</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">Last updated: {privacyMeta.lastUpdated}</p>
        <p className="mt-4 text-sm leading-relaxed">
          Operator: <strong>Chaitanya Prabuddha</strong>. Full text is also in the{" "}
          <a
            href="https://github.com/chayprabs/pdf-visual-diff-online/tree/main/legal"
            className="text-[var(--accent)] hover:underline"
            rel="noopener noreferrer"
            target="_blank"
          >
            legal/
          </a>{" "}
          folder on GitHub.
        </p>
        <LegalProse sections={privacySections} />
        <Link href="/" className="mt-10 inline-block text-sm text-[var(--accent)] hover:underline">
          ← Back to PdfDiff
        </Link>
      </article>
      <Footer />
    </div>
  );
}
