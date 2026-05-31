import { Footer } from "@/components/Footer";
import { TopBar } from "@/components/TopBar";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — PdfDiff",
};

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <TopBar />
      <article className="mx-auto max-w-3xl flex-1 px-4 py-12 sm:px-6 prose prose-neutral">
        <h1 className="text-2xl font-semibold">Privacy Policy</h1>
        <p className="mt-4 text-sm text-[var(--muted)]">Last updated: May 31, 2026</p>

        <section className="mt-8 space-y-4 text-sm leading-relaxed">
          <p>
            PdfDiff (&quot;we&quot;, &quot;the service&quot;) is operated as an open-source tool. This policy
            explains how we handle information when you use the comparison playground.
          </p>
          <h2 className="text-lg font-medium">What we process</h2>
          <p>
            When you upload PDF files, they are processed on the server solely to produce a diff
            result. We do not use uploads for advertising, profiling, or unrelated purposes.
          </p>
          <h2 className="text-lg font-medium">Retention</h2>
          <p>
            Uploaded files and generated artifacts are stored in ephemeral job directories and
            deleted automatically after a short TTL (default one hour). We do not retain PDF
            content in application logs.
          </p>
          <h2 className="text-lg font-medium">Logging</h2>
          <p>
            Server logs may record request metadata (timestamps, status codes, job IDs). File
            contents, passwords, and sensitive filenames are not logged intentionally.
          </p>
          <h2 className="text-lg font-medium">Third parties</h2>
          <p>
            Self-hosted deployments control their own infrastructure. The public demo may use
            hosting providers subject to their respective privacy policies. No third-party
            advertising trackers are embedded in the application.
          </p>
          <h2 className="text-lg font-medium">Your rights</h2>
          <p>
            Because uploads are ephemeral, deletion occurs automatically at TTL expiry. For
            questions about this policy, contact the repository maintainer via GitHub issues.
          </p>
          <h2 className="text-lg font-medium">Disclaimer</h2>
          <p>
            The service is provided &quot;as is&quot; without warranties. You are responsible for ensuring
            you have the right to upload and compare documents you submit.
          </p>
        </section>
        <Link href="/" className="mt-8 inline-block text-sm text-[var(--accent)] hover:underline">
          ← Back to PdfDiff
        </Link>
      </article>
      <Footer />
    </div>
  );
}
