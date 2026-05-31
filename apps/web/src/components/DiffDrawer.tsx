"use client";

import type { DiffResult } from "@pdf-diff/shared-types";

export function DiffDrawer({ result }: { result: DiffResult }) {
  return (
    <aside
      className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto"
      aria-label="Diff summary and object changes"
    >
      <h3 className="text-sm font-semibold">Summary</h3>
      <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{result.summary}</p>

      {result.textDiff && result.textDiff.length > 0 && (
        <section className="mt-4">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
            Text diff
          </h4>
          <ul className="mt-2 space-y-1 text-sm">
            {result.textDiff.map((td) => (
              <li key={td.page} className="rounded bg-[#f5f5f5] px-2 py-1">
                Page {td.page}: {td.changes?.length ?? 0} change(s)
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-4">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
          Signatures
        </h4>
        <dl className="mt-2 space-y-1 text-sm">
          <div className="flex justify-between gap-2">
            <dt className="text-[var(--muted)]">Baseline</dt>
            <dd>{result.signatures.baseline.present ? "Present" : "None"}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-[var(--muted)]">Candidate</dt>
            <dd>{result.signatures.candidate.present ? "Present" : "None"}</dd>
          </div>
        </dl>
      </section>

      <section className="mt-4">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
          Object diff
        </h4>
        <pre className="mt-2 max-h-48 overflow-auto rounded bg-[#f5f5f5] p-2 text-xs">
          {JSON.stringify(result.objectDiff ?? {}, null, 2)}
        </pre>
      </section>

      <section className="mt-4">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
          Metadata &amp; resources
        </h4>
        <pre className="mt-2 max-h-48 overflow-auto rounded bg-[#f5f5f5] p-2 text-xs">
          {JSON.stringify(
            { metadataDiff: result.metadataDiff, fontDiff: result.fontDiff },
            null,
            2,
          )}
        </pre>
      </section>
    </aside>
  );
}
