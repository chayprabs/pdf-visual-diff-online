import type { ReactNode } from "react";

export type LegalSection = {
  id: string;
  title: string;
  content: ReactNode;
};

export function LegalProse({ sections }: { sections: LegalSection[] }) {
  return (
    <section className="mt-8 space-y-8 text-sm leading-relaxed text-[var(--foreground)]">
      {sections.map((s) => (
        <div key={s.id} id={s.id}>
          <h2 className="text-lg font-medium">{s.title}</h2>
          <div className="mt-3 space-y-3 text-[var(--foreground)]">{s.content}</div>
        </div>
      ))}
    </section>
  );
}
