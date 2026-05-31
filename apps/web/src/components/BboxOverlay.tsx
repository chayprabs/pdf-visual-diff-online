"use client";

import type { PageChange } from "@pdf-diff/shared-types";

export function BboxOverlay({
  changes,
  imageWidth,
  imageHeight,
}: {
  changes: PageChange[];
  imageWidth: number;
  imageHeight: number;
}) {
  if (!imageWidth || !imageHeight) return null;
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox={`0 0 ${imageWidth} ${imageHeight}`}
      preserveAspectRatio="xMidYMid meet"
    >
      {changes
        .filter((c) => c.bbox.some((n) => n > 0))
        .map((c, i) => {
          const [x0, y0, x1, y1] = c.bbox;
          return (
            <rect
              key={i}
              x={x0}
              y={y0}
              width={Math.max(x1 - x0, 2)}
              height={Math.max(y1 - y0, 2)}
              fill="none"
              stroke="#2563eb"
              strokeWidth={2}
              rx={2}
            />
          );
        })}
    </svg>
  );
}
