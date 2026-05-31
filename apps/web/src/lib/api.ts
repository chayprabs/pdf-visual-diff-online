import type { DiffResult } from "@pdf-diff/shared-types";

const API_BASE = "/api";

export interface DiffRequestOptions {
  dpi?: number;
  tolerance?: number;
  threshold?: number;
  mode?: "diff" | "assert";
  baselinePassword?: string;
  candidatePassword?: string;
  signal?: AbortSignal;
}

export async function runDiff(
  baseline: File,
  candidate: File,
  options: DiffRequestOptions = {},
): Promise<DiffResult> {
  const form = new FormData();
  form.append("baseline", baseline);
  form.append("candidate", candidate);
  form.append("dpi", String(options.dpi ?? 150));
  form.append("tolerance", String(options.tolerance ?? 12));
  if (options.baselinePassword) form.append("baseline_password", options.baselinePassword);
  if (options.candidatePassword) form.append("candidate_password", options.candidatePassword);

  const endpoint = options.mode === "assert" ? "/v1/assert" : "/v1/diff";
  if (options.mode === "assert") {
    form.append("threshold", String(options.threshold ?? 0.5));
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    body: form,
    signal: options.signal,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed (${res.status})`);
  }

  const data = await res.json();
  if (data.assertion) {
    if ("pass" in data.assertion === false && "pass_" in data.assertion) {
      data.assertion.pass = data.assertion.pass_;
    }
    if (data.assertion.failureReason === undefined && data.assertion.failure_reason) {
      data.assertion.failureReason = data.assertion.failure_reason;
    }
  }
  return data as DiffResult;
}

export function artifactUrl(path: string | undefined): string | undefined {
  if (!path) return undefined;
  if (path.startsWith("http")) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}${normalized}`;
}
