import { Footer } from "@/components/Footer";
import { PdfDiffPlayground } from "@/components/PdfDiffPlayground";
import { TopBar } from "@/components/TopBar";

export function SeoLanding({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex min-h-screen flex-col">
      <TopBar />
      <div className="w-full border-b border-[var(--border)] bg-[#f5f5f5]">
        <div className="mx-auto max-w-5xl px-4 py-3 sm:px-6">
          <h1 className="text-base font-semibold text-[var(--foreground)]">{title}</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">{subtitle}</p>
        </div>
      </div>
      <main className="flex-1">
        <PdfDiffPlayground />
      </main>
      <Footer />
    </div>
  );
}
