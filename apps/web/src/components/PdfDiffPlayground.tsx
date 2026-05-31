"use client";

import type { DiffResult, PageDiff } from "@pdf-diff/shared-types";
import { DiffDrawer } from "@/components/DiffDrawer";
import { PagePreview } from "@/components/PagePreview";
import { Download, FileUp, Loader2, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { artifactUrl, runDiff } from "@/lib/api";

const MAX_MB = 50;

type ViewMode = "baseline" | "candidate" | "overlay" | "mask" | "summary";

const SAMPLES = [
  { name: "Contract v1 vs v2", baseline: "/samples/contract-v1.pdf", candidate: "/samples/contract-v2.pdf" },
  { name: "Signature removed", baseline: "/samples/signed-baseline.pdf", candidate: "/samples/signed-candidate-unsigned.pdf" },
  { name: "Report drift", baseline: "/samples/report-baseline.pdf", candidate: "/samples/report-drift.pdf" },
  { name: "Layout change", baseline: "/samples/layout-a.pdf", candidate: "/samples/layout-b.pdf" },
] as const;

function FileSlot({
  label,
  file,
  onFile,
}: {
  label: string;
  file: File | null;
  onFile: (f: File | null) => void;
}) {
  const [dragOver, setDragOver] = useState(false);

  const acceptFile = (f: File | undefined) => {
    if (!f) return;
    const isPdf =
      f.type === "application/pdf" ||
      f.name.toLowerCase().endsWith(".pdf");
    if (isPdf) onFile(f);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    acceptFile(e.target.files?.[0]);
  };

  return (
    <label
      className={`flex flex-1 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-10 transition ${
        dragOver
          ? "border-[var(--accent)] bg-[#eff6ff]"
          : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)] hover:bg-[#f8faff]"
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        acceptFile(e.dataTransfer.files[0]);
      }}
    >
      <FileUp className="mb-3 h-8 w-8 text-[var(--muted)]" />
      <span className="text-sm font-medium">{label}</span>
      <span className="mt-1 text-xs text-[var(--muted)]">
        {file ? file.name : "Click or drop PDF"}
      </span>
      <input type="file" accept="application/pdf" className="hidden" onChange={onChange} />
    </label>
  );
}

function PageThumbnail({
  page,
  selected,
  onSelect,
}: {
  page: PageDiff;
  selected: boolean;
  onSelect: () => void;
}) {
  const changed = page.pixelDiffPct > 0 || (page.changes?.length ?? 0) > 0;
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-current={selected ? "true" : undefined}
      className={`relative rounded-lg border px-3 py-2 text-left text-sm transition ${
        selected
          ? "border-[var(--accent)] bg-[#eff6ff]"
          : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)]"
      }`}
    >
      Page {page.page}
      {changed && (
        <span className="ml-2 inline-block rounded bg-amber-100 px-1.5 py-0.5 text-xs font-medium text-amber-800">
          changed
        </span>
      )}
      {page.pixelDiffPct > 0 && (
        <span className="mt-1 block text-xs text-[var(--muted)]">
          {page.pixelDiffPct.toFixed(2)}% pixels
        </span>
      )}
    </button>
  );
}

export function PdfDiffPlayground() {
  const [baseline, setBaseline] = useState<File | null>(null);
  const [candidate, setCandidate] = useState<File | null>(null);
  const [dpi, setDpi] = useState(150);
  const [tolerance, setTolerance] = useState(12);
  const [threshold, setThreshold] = useState(0.5);
  const [assertMode, setAssertMode] = useState(false);
  const [baselinePassword, setBaselinePassword] = useState("");
  const [candidatePassword, setCandidatePassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DiffResult | null>(null);
  const [selectedPage, setSelectedPage] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>("summary");
  const abortRef = useRef<AbortController | null>(null);

  const loadSample = async (baselineUrl: string, candidateUrl: string) => {
    try {
      const [bRes, cRes] = await Promise.all([fetch(baselineUrl), fetch(candidateUrl)]);
      if (!bRes.ok || !cRes.ok) {
        throw new Error("Could not load sample PDFs");
      }
      const bBlob = await bRes.blob();
      const cBlob = await cRes.blob();
      setBaseline(
        new File([bBlob], baselineUrl.split("/").pop() || "baseline.pdf", {
          type: "application/pdf",
        }),
      );
      setCandidate(
        new File([cBlob], candidateUrl.split("/").pop() || "candidate.pdf", {
          type: "application/pdf",
        }),
      );
      setError(null);
    } catch {
      setError("Failed to load sample files. Run scripts/generate_samples.py.");
    }
  };

  const cancel = () => {
    abortRef.current?.abort();
    setLoading(false);
  };

  const run = useCallback(async () => {
    if (!baseline || !candidate) {
      setError("Please upload both PDF files.");
      return;
    }
    if (baseline.size > MAX_MB * 1024 * 1024 || candidate.size > MAX_MB * 1024 * 1024) {
      setError(`Each PDF must be under ${MAX_MB}MB.`);
      return;
    }
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await runDiff(baseline, candidate, {
        dpi,
        tolerance,
        threshold,
        mode: assertMode ? "assert" : "diff",
        baselinePassword: baselinePassword || undefined,
        candidatePassword: candidatePassword || undefined,
        signal: abortRef.current.signal,
      });
      setResult(data);
      setSelectedPage(data.pages[0]?.page ?? 1);
    } catch (e) {
      if (e instanceof Error && e.name === "AbortError") return;
      setError(e instanceof Error ? e.message : "Comparison failed");
    } finally {
      setLoading(false);
    }
  }, [baseline, candidate, dpi, tolerance, threshold, assertMode, baselinePassword, candidatePassword]);

  const currentPage = result?.pages.find((p) => p.page === selectedPage);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <h1 className="sr-only">Compare PDFs online</h1>
      <div className="mb-4 flex flex-wrap gap-2">
        {SAMPLES.map((s) => (
          <button
            key={s.name}
            type="button"
            onClick={() => loadSample(s.baseline, s.candidate)}
            className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--foreground)]"
          >
            Sample: {s.name}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-4 sm:flex-row">
        <FileSlot label="Baseline PDF" file={baseline} onFile={setBaseline} />
        <FileSlot label="Candidate PDF" file={candidate} onFile={setCandidate} />
      </div>

      <div className="mt-6 flex flex-wrap items-end gap-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
        <label className="flex flex-col gap-1 text-sm">
          DPI
          <input
            type="number"
            min={36}
            max={600}
            value={dpi}
            onChange={(e) => {
              const v = parseInt(e.target.value, 10);
              setDpi(Number.isFinite(v) ? v : 150);
            }}
            className="w-24 rounded border border-[var(--border)] px-2 py-1"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Anti-alias tolerance
          <input
            type="range"
            min={0}
            max={50}
            value={tolerance}
            onChange={(e) => setTolerance(Number(e.target.value))}
            className="w-40"
          />
          <span className="text-xs text-[var(--muted)]">{tolerance}</span>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={assertMode}
            onChange={(e) => setAssertMode(e.target.checked)}
          />
          CI assert mode
        </label>
        {assertMode && (
          <label className="flex flex-col gap-1 text-sm">
            Threshold (%)
            <input
              type="number"
              step={0.1}
              min={0}
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="w-24 rounded border border-[var(--border)] px-2 py-1"
            />
          </label>
        )}
        <label className="flex flex-col gap-1 text-sm">
          Baseline password
          <input
            type="password"
            value={baselinePassword}
            onChange={(e) => setBaselinePassword(e.target.value)}
            placeholder="Optional"
            className="w-36 rounded border border-[var(--border)] px-2 py-1"
            autoComplete="off"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Candidate password
          <input
            type="password"
            value={candidatePassword}
            onChange={(e) => setCandidatePassword(e.target.value)}
            placeholder="Optional"
            className="w-36 rounded border border-[var(--border)] px-2 py-1"
            autoComplete="off"
          />
        </label>
        <div className="ml-auto flex gap-2">
          {loading && (
            <button
              type="button"
              onClick={cancel}
              className="flex items-center gap-1 rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm hover:bg-[#f5f5f5]"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
          )}
          <button
            type="button"
            onClick={run}
            disabled={loading}
            aria-busy={loading}
            className="flex items-center gap-2 rounded-lg bg-[var(--accent)] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[var(--accent-hover)] disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Comparing…
              </>
            ) : (
              "Compare PDFs"
            )}
          </button>
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      )}

      {result && (
        <div className="mt-8 space-y-6">
          {result.assertion && (
            <div
              className={`rounded-lg px-4 py-3 text-center text-sm font-semibold ${
                result.assertion.pass
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {result.assertion.pass ? "PASS" : "FAIL"} — observed{" "}
              {result.assertion.observed.toFixed(2)}% pixel diff (threshold{" "}
              {result.assertion.threshold}%)
              {!result.assertion.pass &&
                result.assertion.failureReason &&
                result.assertion.failureReason !== "pixel_threshold" && (
                  <span className="mt-1 block text-xs font-normal">
                    Also failed: structural/text/signature or page-count changes
                    {result.assertion.failureReason === "page_count_mismatch"
                      ? " (page count mismatch)"
                      : ""}
                  </span>
                )}
            </div>
          )}

          {result.bundleUrl && (
            <a
              href={artifactUrl(result.bundleUrl)}
              download
              className="inline-flex items-center gap-2 text-sm text-[var(--accent)] hover:underline"
            >
              <Download className="h-4 w-4" />
              Download diff bundle (ZIP)
            </a>
          )}

          <div className="flex flex-wrap gap-2">
            {result.pages.map((p) => (
              <PageThumbnail
                key={p.page}
                page={p}
                selected={selectedPage === p.page}
                onSelect={() => setSelectedPage(p.page)}
              />
            ))}
          </div>

          <div className="flex flex-wrap gap-2 border-b border-[var(--border)] pb-2" role="tablist" aria-label="Page view mode">
            {(["summary", "baseline", "candidate", "mask", "overlay"] as ViewMode[]).map((m) => (
              <button
                key={m}
                type="button"
                role="tab"
                aria-selected={viewMode === m}
                onClick={() => setViewMode(m)}
                className={`rounded px-3 py-1 text-sm capitalize ${
                  viewMode === m
                    ? "bg-[var(--accent)] text-white"
                    : "text-[var(--muted)] hover:bg-[#f0f0f0]"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {currentPage && (
            <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
                <h3 className="mb-3 text-sm font-medium">Page {currentPage.page}</h3>
                {viewMode === "summary" ? (
                  <ul className="space-y-2 text-sm">
                    {currentPage.changes.length === 0 ? (
                      <li className="text-[var(--muted)]">No changes on this page.</li>
                    ) : (
                      currentPage.changes.map((c, i) => (
                        <li key={i} className="rounded bg-[#f5f5f5] px-3 py-2">
                          <span className="font-medium capitalize">{c.kind}</span>:{" "}
                          {c.description}
                        </li>
                      ))
                    )}
                  </ul>
                ) : (
                  <PagePreview
                    page={currentPage}
                    viewMode={viewMode as "baseline" | "candidate" | "mask" | "overlay"}
                  />
                )}
              </div>
              <DiffDrawer result={result} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
