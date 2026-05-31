import { Footer } from "@/components/Footer";
import { TopBar } from "@/components/TopBar";
import Link from "next/link";

export const metadata = {
  title: "Terms & Conditions — PdfDiff",
};

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <TopBar />
      <article className="mx-auto max-w-3xl flex-1 px-4 py-12 sm:px-6">
        <h1 className="text-2xl font-semibold">Terms &amp; Conditions</h1>
        <p className="mt-4 text-sm text-[var(--muted)]">Last updated: May 31, 2026</p>

        <section className="mt-8 space-y-4 text-sm leading-relaxed">
          <p>
            By using PdfDiff, you agree to these terms. If you do not agree, do not use the
            service.
          </p>
          <h2 className="text-lg font-medium">Service description</h2>
          <p>
            PdfDiff compares PDF documents and returns visual, textual, and structural difference
            reports. Results are informational and not legal advice.
          </p>
          <h2 className="text-lg font-medium">Acceptable use</h2>
          <p>
            You may only upload documents you are authorized to process. You must not use the
            service to distribute malware, violate laws, or infringe intellectual property.
          </p>
          <h2 className="text-lg font-medium">No warranties</h2>
          <p>
            THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND,
            EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
            NON-INFRINGEMENT. We do not guarantee accuracy of diff results, signature validity
            assessments, or suitability for compliance or legal decisions.
          </p>
          <h2 className="text-lg font-medium">Limitation of liability</h2>
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, THE OPERATORS AND CONTRIBUTORS SHALL NOT BE
            LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR
            ANY LOSS OF PROFITS, DATA, OR GOODWILL, ARISING FROM YOUR USE OF THE SERVICE.
          </p>
          <h2 className="text-lg font-medium">Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless the operators and contributors from claims
            arising out of your uploads, misuse of the service, or violation of these terms.
          </p>
          <h2 className="text-lg font-medium">Open source</h2>
          <p>
            Source code is licensed under AGPL-3.0. Self-hosting and modification are subject to
            that license.
          </p>
          <h2 className="text-lg font-medium">Changes</h2>
          <p>
            We may update these terms. Continued use after changes constitutes acceptance of the
            revised terms.
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
