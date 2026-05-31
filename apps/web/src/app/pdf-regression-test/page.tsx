import type { Metadata } from "next";
import { SeoLanding } from "@/components/SeoLanding";

export const metadata: Metadata = {
  title: "PDF Regression Test — PdfDiff",
  description: "CI-friendly PDF assert mode with pass/fail thresholds for visual regression pipelines.",
};

export default function Page() {
  return (
    <SeoLanding
      title="PDF regression test"
      subtitle="Enable assert mode to fail builds when pixel diff exceeds your configured threshold."
    />
  );
}
