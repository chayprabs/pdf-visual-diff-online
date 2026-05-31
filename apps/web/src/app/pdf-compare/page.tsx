import { Footer } from "@/components/Footer";
import { PdfDiffPlayground } from "@/components/PdfDiffPlayground";
import { SeoBar } from "@/components/SeoBar";
import { TopBar } from "@/components/TopBar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF Compare Online — PdfDiff",
  description: "Compare two PDF files side by side with visual pixel masks and structural diffs.",
};

export default function PdfComparePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <TopBar />
      <SeoBar />
      <main className="flex-1">
        <PdfDiffPlayground />
      </main>
      <Footer />
    </div>
  );
}
