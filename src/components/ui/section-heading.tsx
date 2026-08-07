import { cn } from "@/lib/format";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
  as?: "h1" | "h2";
  compact?: boolean;
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "light",
  as = "h2",
  compact = false,
  className,
}: SectionHeadingProps) {
  const Heading = as;

  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            compact ? "mb-2 text-[0.68rem] font-semibold uppercase tracking-[0.2em]" : "mb-4 text-xs font-semibold uppercase tracking-[0.22em]",
            tone === "dark" ? "text-white/58" : "text-[var(--color-rust)]",
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <Heading
        className={cn(
          compact
            ? "font-serif text-3xl leading-tight md:text-4xl"
            : "font-serif text-4xl leading-tight md:text-5xl",
          tone === "dark" ? "text-white" : "text-[var(--color-ink)]",
        )}
      >
        {title}
      </Heading>
      {description ? (
        <p
          className={cn(
            compact ? "mt-3 text-sm leading-6 md:text-base md:leading-7" : "mt-5 text-base leading-8 md:text-lg",
            tone === "dark" ? "text-white/68" : "text-[var(--color-muted)]",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
