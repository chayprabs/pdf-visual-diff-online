import type { Metadata } from "next";
import "./globals.css";

const siteDescription =
  "Compare PDFs visually and structurally online — per-page masks, text and object diffs, signature checks and human-readable summaries.";

export const metadata: Metadata = {
  title: "PdfDiff — Compare PDFs Online",
  description: siteDescription,
  keywords: [
    "pdf",
    "pdf-diff",
    "pdf-compare",
    "visual-diff",
    "visual-regression",
    "pdf-tools",
    "document-comparison",
    "pymupdf",
    "pdf-text-diff",
    "signed-pdf",
    "document-automation",
    "online-tool",
  ],
  openGraph: {
    title: "PdfDiff — Compare PDFs Online",
    description: siteDescription,
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "PdfDiff",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  description: siteDescription,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
