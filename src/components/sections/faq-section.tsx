import { HelpCircle } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import type { HouseFaq } from "@/types/house";

type FaqSectionProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  items: HouseFaq[];
  tone?: "paper" | "shell";
};

export function FaqSection({
  eyebrow = "FAQ",
  title = "Perguntas frequentes",
  description = "Respostas rápidas para seguir com a consulta de disponibilidade com mais clareza.",
  items,
  tone = "paper",
}: FaqSectionProps) {
  if (!items.length) return null;

  return (
    <section
      id="faq"
      className={`section-anchor px-4 py-10 md:px-6 md:py-14 xl:px-8 ${
        tone === "shell" ? "bg-[var(--color-shell)]" : "bg-[var(--color-paper)]"
      }`}
    >
      <div className="mx-auto grid max-w-7xl gap-7 lg:grid-cols-[0.55fr_1fr]">
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          description={description}
          compact
        />
        <div className="grid gap-3">
          {items.map((item) => (
            <details
              key={item.question}
              className="group border border-[var(--color-line)] bg-white/50 p-4 open:bg-[var(--color-shell)]"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-[var(--color-ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-gold)]">
                <span className="flex items-center gap-3">
                  <HelpCircle aria-hidden="true" className="shrink-0 text-[var(--color-ocean)]" size={18} />
                  {item.question}
                </span>
                <span className="text-[var(--color-copper)] transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 border-t border-[var(--color-line)] pt-3 text-sm leading-6 text-[var(--color-muted)]">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
