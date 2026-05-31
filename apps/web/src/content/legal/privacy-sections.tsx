import type { LegalSection } from "@/components/LegalProse";

const LAST_UPDATED = "May 31, 2026";

export const privacyMeta = {
  lastUpdated: LAST_UPDATED,
  title: "Privacy Policy — PdfDiff",
};

export const privacySections: LegalSection[] = [
  {
    id: "scope",
    title: "1. Scope",
    content: (
      <>
        <p>
          This policy applies to the PdfDiff website, API, and operator-hosted instances operated by{" "}
          <strong>Chaitanya Prabuddha</strong>. Self-hosted deployments are run by separate operators
          who are their own data controllers.
        </p>
        <p className="text-[var(--muted)]">Last updated: {LAST_UPDATED}</p>
      </>
    ),
  },
  {
    id: "summary",
    title: "2. Summary",
    content: (
      <ul className="list-disc space-y-2 pl-5">
        <li>PDFs are processed only to produce comparison results.</li>
        <li>Uploads and artifacts are ephemeral (default TTL about one hour).</li>
        <li>We do not sell personal information or use uploads for advertising.</li>
        <li>We do not intentionally log PDF content or passwords.</li>
        <li>You must not upload unlawful or unnecessary personal data.</li>
      </ul>
    ),
  },
  {
    id: "data",
    title: "3. Information we process",
    content: (
      <>
        <p>We may process: uploaded PDFs; optional PDF passwords; technical data (IP, user agent, timestamps, job IDs); minimal cookies if used; and communications via GitHub or security channels. We do not require accounts for the public playground.</p>
      </>
    ),
  },
  {
    id: "legal-bases",
    title: "4. Legal bases (EEA, UK, Switzerland)",
    content: (
      <p>
        Where GDPR or UK GDPR applies: service delivery under <strong>contract</strong> or steps at your request; security and operations under <strong>legitimate interests</strong>; legal compliance under <strong>legal obligation</strong>; and <strong>consent</strong> where required for optional features.
      </p>
    ),
  },
  {
    id: "retention",
    title: "5. Retention",
    content: (
      <p>
        Uploaded PDFs and generated artifacts are deleted after TTL expiry (default one hour). Server logs are kept for short operational periods unless law or security requires longer retention. We do not retain PDF content in application logs by design.
      </p>
    ),
  },
  {
    id: "sharing",
    title: "6. Sharing and subprocessors",
    content: (
      <p>
        We do not sell personal information. Infrastructure providers process data on our instructions. We may disclose information if required by valid legal process. International transfers may occur (e.g. United States); appropriate safeguards are used where required by law.
      </p>
    ),
  },
  {
    id: "security",
    title: "7. Security",
    content: (
      <p>
        We use reasonable measures including ephemeral storage, TLS, and access controls. No system is completely secure. For highly sensitive documents, consider self-hosting on infrastructure you control.
      </p>
    ),
  },
  {
    id: "rights",
    title: "8. Your rights",
    content: (
      <>
        <p>
          Depending on your location, you may have rights to access, rectify, erase, restrict, port, or object to processing, and to lodge a complaint with a supervisory authority. Contact us via{" "}
          <a href="https://github.com/chayprabs/pdf-visual-diff-online" className="text-[var(--accent)] underline" rel="noopener noreferrer" target="_blank">
            GitHub
          </a>{" "}
          or{" "}
          <a href="https://www.chaitanyaprabuddha.com" className="text-[var(--accent)] underline" rel="noopener noreferrer" target="_blank">
            chaitanyaprabuddha.com
          </a>
          .
        </p>
        <p>
          <strong>California (CCPA/CPRA):</strong> We do not sell or share personal information for cross-context behavioral advertising. California residents may request know, delete, correct, and non-discrimination rights.
        </p>
        <p>
          <strong>Other regions:</strong> Rights under LGPD, PIPEDA, Australian Privacy Act, and U.S. state laws may apply—contact us to exercise them.
        </p>
      </>
    ),
  },
  {
    id: "children",
    title: "9. Children",
    content: (
      <p>
        The service is not directed to children under 13 (or 16 in the EEA where applicable). We do not knowingly collect children&apos;s data.
      </p>
    ),
  },
  {
    id: "automated",
    title: "10. Automated processing",
    content: (
      <p>
        Results are produced by automated algorithms. We do not use uploads for automated decisions with legal or similarly significant effects about individuals without human involvement.
      </p>
    ),
  },
  {
    id: "responsibilities",
    title: "11. Your responsibilities",
    content: (
      <p>
        Minimize personal data in uploads. Ensure you have a lawful basis to process any personal data in PDFs. Avoid special-category data unless you have explicit legal grounds and safeguards.
      </p>
    ),
  },
  {
    id: "self-hosted",
    title: "12. Self-hosted deployments",
    content: (
      <p>
        If you operate PdfDiff, you are the data controller for your users. Configure retention and publish your own privacy notice.
      </p>
    ),
  },
  {
    id: "changes",
    title: "13. Changes",
    content: (
      <p>
        We may update this policy with a new date. Continued use constitutes acknowledgment where permitted by law.
      </p>
    ),
  },
  {
    id: "disclaimer",
    title: "14. Disclaimer",
    content: (
      <p>
        This policy does not create contractual rights in third parties except as required by law. The service is provided without warranties—see{" "}
        <a href="/terms" className="text-[var(--accent)] underline">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="/license" className="text-[var(--accent)] underline">
          License &amp; Disclaimer
        </a>
        .
      </p>
    ),
  },
];
