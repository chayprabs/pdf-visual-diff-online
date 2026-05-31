import type { Metadata } from "next";
import { SeoLanding } from "@/components/SeoLanding";

export const metadata: Metadata = {
  title: "PDF Signature Check — PdfDiff",
  description: "Detect missing or changed digital signatures when comparing PDF revisions.",
};

export default function Page() {
  return (
    <SeoLanding
      title="PDF signature check"
      subtitle="Compare signature presence between baseline and candidate PDFs as part of a full structural diff."
    />
  );
}
