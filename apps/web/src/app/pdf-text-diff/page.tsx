import type { Metadata } from "next";
import { SeoLanding } from "@/components/SeoLanding";

export const metadata: Metadata = {
  title: "PDF Text Diff — PdfDiff",
  description: "Position-aware text diff for PDFs — moved text is not reported as add plus remove.",
};

export default function Page() {
  return (
    <SeoLanding
      title="PDF text diff"
      subtitle="Extract text with bounding boxes and diff position-aware changes across revisions."
    />
  );
}
