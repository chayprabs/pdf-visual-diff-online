import type { Metadata } from "next";
import { SeoLanding } from "@/components/SeoLanding";

export const metadata: Metadata = {
  title: "PDF Visual Diff — PdfDiff",
  description: "Visual regression testing for PDFs with per-page pixel masks and tolerance controls.",
};

export default function Page() {
  return (
    <SeoLanding
      title="PDF visual diff"
      subtitle="Render pages at configurable DPI and highlight pixel-level changes with anti-alias tolerance."
    />
  );
}
