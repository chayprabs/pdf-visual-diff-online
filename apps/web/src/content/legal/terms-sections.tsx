import type { LegalSection } from "@/components/LegalProse";

const LAST_UPDATED = "May 31, 2026";

export const termsMeta = {
  lastUpdated: LAST_UPDATED,
  title: "Terms of Service — PdfDiff",
};

export const termsSections: LegalSection[] = [
  {
    id: "agreement",
    title: "1. Agreement",
    content: (
      <p>
        By using PdfDiff you agree to these Terms, our{" "}
        <a href="/privacy" className="text-[var(--accent)] underline">
          Privacy Policy
        </a>
        , and{" "}
        <a href="/license" className="text-[var(--accent)] underline">
          License &amp; Disclaimer
        </a>
        . If you do not agree, do not use the service. If you act for an organization, you represent you have authority to bind it.
      </p>
    ),
  },
  {
    id: "eligibility",
    title: "2. Eligibility",
    content: (
      <p>
        You must be at least 18 (or age of majority where you live) and not prohibited by law, including export-control or sanctions rules, from using the service.
      </p>
    ),
  },
  {
    id: "service",
    title: "3. Service description",
    content: (
      <p>
        PdfDiff compares PDFs and returns informational reports. We may modify or discontinue the service without liability. The service is free unless you separately agree to paid terms with an operator.
      </p>
    ),
  },
  {
    id: "acceptable-use",
    title: "4. Acceptable use",
    content: (
      <ul className="list-disc space-y-2 pl-5">
        <li>Upload only documents you have the right to process.</li>
        <li>Do not upload malware, unlawful content, or infringe third-party rights.</li>
        <li>Do not attack, overload, or misuse infrastructure.</li>
        <li>Do not present output as legal certification, compliance approval, or cryptographic signature validation.</li>
        <li>You are solely responsible for uploads and use of results.</li>
      </ul>
    ),
  },
  {
    id: "ip",
    title: "5. Intellectual property",
    content: (
      <>
        <p>
          You retain ownership of your PDFs. You grant us a limited license to process uploads solely to operate the service. Source code is under{" "}
          <a href="/license" className="text-[var(--accent)] underline">
            GNU AGPL-3.0
          </a>
          . Feedback may be used without obligation to you.
        </p>
      </>
    ),
  },
  {
    id: "warranties",
    title: "6. No warranties",
    content: (
      <p className="uppercase">
        THE SERVICE AND ALL OUTPUT ARE PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, ACCURACY, UNINTERRUPTED OPERATION, OR SECURITY. SOME JURISDICTIONS DO NOT ALLOW CERTAIN EXCLUSIONS; THEY APPLY TO THE MAXIMUM EXTENT PERMITTED.
      </p>
    ),
  },
  {
    id: "liability",
    title: "7. Limitation of liability",
    content: (
      <>
        <p className="uppercase">
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE, CONTRIBUTORS, AFFILIATES, AND PROVIDERS ARE NOT LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, OR LOSS OF PROFITS, DATA, GOODWILL, OR BUSINESS, EVEN IF ADVISED OF THE POSSIBILITY.
        </p>
        <p className="mt-3 uppercase">
          OUR TOTAL AGGREGATE LIABILITY SHALL NOT EXCEED THE GREATER OF (A) USD $100 OR (B) AMOUNTS YOU PAID US IN THE PRIOR 12 MONTHS (ZERO FOR FREE USE).
        </p>
        <p className="mt-3">
          Nothing excludes liability that cannot be excluded under applicable law (including certain consumer rights or death/personal injury from negligence where limitation is unlawful).
        </p>
      </>
    ),
  },
  {
    id: "indemnity",
    title: "8. Indemnification",
    content: (
      <p>
        You will defend, indemnify, and hold harmless us and contributors from claims, damages, and expenses (including reasonable attorneys&apos; fees) arising from your uploads, use, violation of these Terms, or violation of third-party rights.
      </p>
    ),
  },
  {
    id: "release",
    title: "9. Release",
    content: (
      <p>
        To the extent permitted by law, you release us and contributors from claims arising from use of the service or third-party actions related to documents you submitted. Where a general release of unknown claims is prohibited, this applies to the maximum extent permitted.
      </p>
    ),
  },
  {
    id: "disputes",
    title: "10. Dispute resolution",
    content: (
      <>
        <p>
          <strong>Informal resolution:</strong> Contact us via GitHub for at least 30 days before filing a claim.
        </p>
        <p>
          <strong>Governing law:</strong> California, USA (excluding conflict-of-law rules), except where mandatory local law applies.
        </p>
        <p>
          <strong>Arbitration (where enforceable):</strong> Binding individual arbitration under AAA rules in San Francisco, California, in English.{" "}
          <strong>Class actions waived</strong>—disputes only on an individual basis.
        </p>
        <p>
          <strong>Courts:</strong> If arbitration does not apply, exclusive jurisdiction in San Francisco County, California courts.
        </p>
        <p>
          <strong>Limitation period:</strong> Claims must be brought within one (1) year, except where law requires longer.
        </p>
      </>
    ),
  },
  {
    id: "export",
    title: "11. Export and international use",
    content: (
      <p>
        You may not use the service in violation of U.S. export controls, sanctions, or analogous laws. You represent you are not in a comprehensively embargoed country or on denied-party lists.
      </p>
    ),
  },
  {
    id: "consumers",
    title: "12. Consumer notices (EEA, UK, Australia)",
    content: (
      <p>
        Mandatory statutory consumer rights may apply and are not limited where they cannot be waived. EU/UK consumers may lodge complaints with their data protection authority—see the Privacy Policy.
      </p>
    ),
  },
  {
    id: "third-party",
    title: "13. Third-party services",
    content: <p>Hosting and infrastructure may be provided by third parties; we are not responsible for their acts. Your use may be subject to their terms.</p>,
  },
  {
    id: "open-source",
    title: "14. Open-source software",
    content: (
      <p>
        Software is under AGPL-3.0. These Terms govern your use of hosted services we operate; the AGPL governs software use, modification, and distribution.
      </p>
    ),
  },
  {
    id: "changes",
    title: "15. Changes, severability, entire agreement",
    content: (
      <>
        <p>We may update these Terms by posting a new date. Continued use is acceptance. Invalid provisions are severed or modified minimally; the rest remains in effect. These Terms, the Privacy Policy, and Disclaimer are the entire agreement for the hosted service.</p>
        <p className="mt-3 text-[var(--muted)]">Last updated: {LAST_UPDATED} · Operator: Chaitanya Prabuddha</p>
      </>
    ),
  },
];
