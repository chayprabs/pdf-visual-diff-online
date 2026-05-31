"use client";

import type { PageDiff } from "@pdf-diff/shared-types";
import { BboxOverlay } from "@/components/BboxOverlay";
import { artifactUrl } from "@/lib/api";
import { useEffect, useState } from "react";

type ViewMode = "baseline" | "candidate" | "overlay" | "mask";

export function PagePreview({
  page,
  viewMode,
}: {
  page: PageDiff;
  viewMode: ViewMode;
}) {
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    setSize({ w: 0, h: 0 });
  }, [viewMode, page.page]);

  const url =
    viewMode === "baseline"
      ? page.baselineUrl
      : viewMode === "candidate"
        ? page.candidateUrl
        : viewMode === "mask"
          ? page.maskUrl
          : page.baselineUrl;

  const showBbox =
    size.w > 0 &&
    (viewMode === "baseline" || viewMode === "candidate" || viewMode === "overlay" || viewMode === "mask");

  if (viewMode === "overlay" && (page.baselineUrl || page.maskUrl)) {
    return (
      <div className="relative max-h-96">
        {page.baselineUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={artifactUrl(page.baselineUrl)!}
            alt=""
            className="w-full object-contain"
            onLoad={(e) =>
              setSize({ w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight })
            }
          />
        )}
        {page.maskUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={artifactUrl(page.maskUrl)!}
            alt={`Overlay page ${page.page}`}
            className="absolute inset-0 w-full object-contain opacity-60 mix-blend-multiply"
          />
        )}
        {showBbox && <BboxOverlay changes={page.changes} imageWidth={size.w} imageHeight={size.h} />}
      </div>
    );
  }

  if (!url) {
    return <p className="text-sm text-[var(--muted)]">No preview for this view.</p>;
  }

  return (
    <div className="relative max-h-96">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={artifactUrl(url)!}
        alt={`${viewMode} page ${page.page}`}
        className="w-full object-contain"
        onLoad={(e) =>
          setSize({ w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight })
        }
      />
      {showBbox && <BboxOverlay changes={page.changes} imageWidth={size.w} imageHeight={size.h} />}
    </div>
  );
}
