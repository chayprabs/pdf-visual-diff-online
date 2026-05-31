import { Footer } from "@/components/Footer";
import { LegalProse } from "@/components/LegalProse";
import { TopBar } from "@/components/TopBar";
import { licenseMeta, licenseSections } from "@/content/legal/license-sections";
import Link from "next/link";

export const metadata = {
  title: licenseMeta.title,
  description: "GNU AGPL-3.0 license and service disclaimer for PdfDiff software and hosted use.",
};

export default function LicensePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <TopBar />
      <article className="mx-auto max-w-3xl flex-1 px-4 py-12 sm:px-6">
        <h1 className="text-2xl font-semibold">License &amp; Disclaimer</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">Last updated: {licenseMeta.lastUpdated}</p>
        <LegalProse sections={licenseSections} />
        <Link href="/" className="mt-10 inline-block text-sm text-[var(--accent)] hover:underline">
          ← Back to PdfDiff
        </Link>
      </article>
      <Footer />
    </div>
  );
}
