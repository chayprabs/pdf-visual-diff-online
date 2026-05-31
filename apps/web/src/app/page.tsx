import { Footer } from "@/components/Footer";
import { PdfDiffPlayground } from "@/components/PdfDiffPlayground";
import { SeoBar } from "@/components/SeoBar";
import { TopBar } from "@/components/TopBar";

export default function HomePage() {
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
