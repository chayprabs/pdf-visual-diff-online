export type ChangeKind = "text" | "annotation" | "image" | "metadata" | "font" | "signature" | "form" | "bookmark" | "attachment";

export interface PageChange {
  kind: ChangeKind;
  bbox: [number, number, number, number];
  description: string;
}

export interface PageDiff {
  page: number;
  pixelDiffPct: number;
  changes: PageChange[];
  maskUrl?: string;
  compositeUrl?: string;
}

export interface SignatureInfo {
  present: boolean;
  valid?: boolean;
  details?: string;
}

export interface AssertionResult {
  pass: boolean;
  threshold: number;
  observed: number;
}

export interface DiffResult {
  pages: PageDiff[];
  metadata: Record<string, unknown>;
  metadataDiff?: Record<string, { before: unknown; after: unknown }>;
  signatures: {
    baseline: SignatureInfo;
    candidate: SignatureInfo;
  };
  textDiff?: { page: number; changes: PageChange[] }[];
  objectDiff?: Record<string, unknown>;
  fontDiff?: Record<string, unknown>;
  summary: string;
  assertion?: AssertionResult;
  bundleUrl?: string;
}

export interface DiffOptions {
  dpi?: number;
  tolerance?: number;
  threshold?: number;
}
