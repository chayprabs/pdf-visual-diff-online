"use client";

import type { DiffResult, FontResourceDiff } from "@pdf-diff/shared-types";

function FontResourceSection({ fontDiff }: { fontDiff: FontResourceDiff | undefined }) {
  if (!fontDiff) return null;
  return (
    <>
      <div className="mt-2 text-sm">
        <p className="font-medium text-[var(--foreground)]">Fonts</p>
        {fontDiff.fonts.added.length > 0 && (
          <p className="text-[var(--muted)]">Added: {fontDiff.fonts.added.join(", ")}</p>
        )}
        {fontDiff.fonts.removed.length > 0 && (
          <p className="text-[var(--muted)]">Removed: {fontDiff.fonts.removed.join(", ")}</p>
        )}
        {fontDiff.fonts.added.length === 0 && fontDiff.fonts.removed.length === 0 && (
          <p className="text-[var(--muted)]">No font changes</p>
        )}
      </div>
      <div className="mt-2 text-sm">
        <p className="font-medium text-[var(--foreground)]">Images</p>
        {fontDiff.images.added.length > 0 && (
          <p className="text-[var(--muted)]">Added: {fontDiff.images.added.join(", ")}</p>
        )}
        {fontDiff.images.removed.length > 0 && (
          <p className="text-[var(--muted)]">Removed: {fontDiff.images.removed.join(", ")}</p>
        )}
        {fontDiff.images.added.length === 0 && fontDiff.images.removed.length === 0 && (
          <p className="text-[var(--muted)]">No image changes</p>
        )}
      </div>
    </>
  );
}

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
          <ul className="mt-2 max-h-40 space-y-2 overflow-y-auto text-sm">
            {result.textDiff.map((td) => (
              <li key={td.page} className="rounded bg-[#f5f5f5] px-2 py-1">
                <span className="font-medium">Page {td.page}</span>
                <ul className="mt-1 space-y-0.5 text-[var(--muted)]">
                  {(td.changes ?? []).slice(0, 5).map((c, i) => (
                    <li key={i}>{c.description}</li>
                  ))}
                </ul>
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
        <pre className="mt-2 max-h-40 overflow-auto rounded bg-[#f5f5f5] p-2 text-xs">
          {JSON.stringify(result.objectDiff ?? {}, null, 2)}
        </pre>
      </section>

      <section className="mt-4">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
          Metadata &amp; resources
        </h4>
        {result.metadataDiff && Object.keys(result.metadataDiff).length > 0 && (
          <pre className="mt-2 max-h-32 overflow-auto rounded bg-[#f5f5f5] p-2 text-xs">
            {JSON.stringify(result.metadataDiff, null, 2)}
          </pre>
        )}
        <FontResourceSection fontDiff={result.fontDiff} />
      </section>
    </aside>
  );
}
