import type { LegalSection } from "@/components/LegalProse";

const LAST_UPDATED = "May 31, 2026";
const GITHUB = "https://github.com/chayprabs/pdf-visual-diff-online";
const AGPL_URL = "https://www.gnu.org/licenses/agpl-3.0.html";

export const licenseMeta = {
  lastUpdated: LAST_UPDATED,
  title: "License & Disclaimer — PdfDiff",
};

export const licenseSections: LegalSection[] = [
  {
    id: "software-license",
    title: "1. Software license (AGPL-3.0)",
    content: (
      <>
        <p>
          Copyright © 2026 Chaitanya Prabuddha. PdfDiff source code is free software licensed under the{" "}
          <a href={AGPL_URL} className="text-[var(--accent)] underline" rel="noopener noreferrer" target="_blank">
            GNU Affero General Public License v3.0
          </a>
          .
        </p>
        <p>
          You may redistribute and modify the software under AGPL terms, including making corresponding source available when you run a modified version as a network service. The full license text is in the{" "}
          <a href={`${GITHUB}/blob/main/LICENSE`} className="text-[var(--accent)] underline" rel="noopener noreferrer" target="_blank">
            LICENSE
          </a>{" "}
          file in the repository.
        </p>
        <p className="uppercase text-xs leading-relaxed text-[var(--muted)]">
          THE PROGRAM IS PROVIDED WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE. SEE THE AGPL FOR FULL WARRANTY DISCLAIMER.
        </p>
      </>
    ),
  },
  {
    id: "no-legal-advice",
    title: "2. No professional advice",
    content: (
      <p>
        PdfDiff output is <strong>informational only</strong>. It is not legal, regulatory, compliance, financial, or security advice. Do not rely on it as the sole basis for disputes, filings, audits, or security decisions.
      </p>
    ),
  },
  {
    id: "accuracy",
    title: "3. No guarantee of accuracy",
    content: (
      <p>
        False positives and false negatives are possible. Signature-related output reflects PDF structure detection, not cryptographic validation under eIDAS, ESIGN, UETA, or local electronic-signature law.
      </p>
    ),
  },
  {
    id: "hosted-service",
    title: "4. Hosted service",
    content: (
      <p>
        Use of a public demo or third-party deployment is also subject to{" "}
        <a href="/terms" className="text-[var(--accent)] underline">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="/privacy" className="text-[var(--accent)] underline">
          Privacy Policy
        </a>
        . Self-hosted operators are responsible for their own compliance.
      </p>
    ),
  },
  {
    id: "your-responsibility",
    title: "5. Your responsibility",
    content: (
      <ul className="list-disc space-y-2 pl-5">
        <li>Ensure you have the right to process every PDF you submit.</li>
        <li>Protect personal and confidential data under applicable law.</li>
        <li>Independently verify results before taking action.</li>
      </ul>
    ),
  },
  {
    id: "liability",
    title: "6. Limitation of liability",
    content: (
      <p>
        To the fullest extent permitted by applicable law, operators and contributors disclaim liability for damages from use or inability to use PdfDiff. See Terms of Service for binding limits on hosted use.
      </p>
    ),
  },
  {
    id: "not-legal-advice-footer",
    title: "7. Not legal advice",
    content: (
      <p className="text-[var(--muted)]">
        These documents are not a substitute for advice from a qualified attorney in your jurisdiction. No legal text can guarantee immunity from lawsuits worldwide.
      </p>
    ),
  },
];
