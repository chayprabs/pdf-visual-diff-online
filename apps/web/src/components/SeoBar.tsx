export function SeoBar() {
  return (
    <div className="w-full border-b border-[var(--border)] bg-[#f5f5f5]">
      <div className="mx-auto max-w-5xl px-4 py-3 sm:px-6">
        <p className="text-sm leading-relaxed text-[var(--muted)]">
          Compare two PDFs visually and structurally — pixel masks, position-aware text diff,
          annotations, signatures, and plain-English summaries.
        </p>
        <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">
          Drop your baseline and candidate PDFs below, adjust tolerance, and download a diff bundle.
        </p>
      </div>
    </div>
  );
}
