import { cn } from "@/lib/format";

type LogoProps = {
  variant?: "light" | "dark";
  orientation?: "horizontal" | "stacked" | "mark";
  showSignature?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
};

export function Logo({
  variant = "dark",
  orientation = "horizontal",
  showSignature = false,
  size = "md",
  className,
}: LogoProps) {
  const isLight = variant === "light";
  const color = isLight ? "text-[var(--color-logo-light)]" : "text-[var(--color-logo-dark)]";
  const accent = isLight
    ? "text-[var(--color-logo-light-muted)]"
    : "text-[var(--color-logo-muted)]";
  const metrics = {
    sm: {
      gap: "gap-2.5",
      mark: "h-8 w-8",
      overline: "text-[0.58rem] tracking-[0.28em]",
      name: "mt-0.5 text-[1.38rem] tracking-[0.02em]",
      signature: "mt-1.5 text-[0.58rem] tracking-[0.14em]",
    },
    md: {
      gap: "gap-3",
      mark: "h-9 w-9",
      overline: "text-[0.62rem] tracking-[0.3em]",
      name: "mt-0.5 text-[1.62rem] tracking-[0.025em]",
      signature: "mt-2 text-[0.62rem] tracking-[0.15em]",
    },
    lg: {
      gap: "gap-3.5",
      mark: "h-11 w-11",
      overline: "text-[0.68rem] tracking-[0.32em]",
      name: "mt-1 text-[1.95rem] tracking-[0.03em]",
      signature: "mt-2 text-[0.66rem] tracking-[0.16em]",
    },
  }[size];

  if (orientation === "mark") {
    return (
      <span className={cn("inline-flex items-center", color, className)} aria-hidden="true">
        <LogoSymbol className={metrics.mark} accentClassName={accent} />
      </span>
    );
  }

  if (orientation === "stacked") {
    return (
      <span className={cn("inline-flex flex-col items-center text-center", color, className)}>
        <LogoSymbol className={cn("shrink-0", metrics.mark)} accentClassName={accent} />
        <span className="mt-1.5 leading-[0.92]">
          <span className={cn("block font-semibold uppercase", metrics.overline)}>
            Casas
          </span>
          <span className={cn("block font-serif font-semibold", metrics.name)}>
            Milagres
          </span>
          {showSignature ? (
            <span
              className={cn(
                "hidden uppercase leading-none opacity-70 sm:block",
                metrics.signature,
              )}
            >
              Hospedagem, conforto e experiências
            </span>
          ) : null}
        </span>
      </span>
    );
  }

  return (
    <span className={cn("inline-flex items-center", metrics.gap, color, className)}>
      <LogoSymbol className={cn("shrink-0", metrics.mark)} accentClassName={accent} />
      <span className="leading-[0.92]">
        <span className={cn("block font-semibold uppercase", metrics.overline)}>
          Casas
        </span>
        <span className={cn("block font-serif font-semibold", metrics.name)}>
          Milagres
        </span>
        {showSignature ? (
          <span
            className={cn(
              "hidden uppercase leading-none opacity-70 sm:block",
              metrics.signature,
            )}
          >
            Hospedagem, conforto e experiências
          </span>
        ) : null}
      </span>
    </span>
  );
}

function LogoSymbol({
  className,
  accentClassName,
}: {
  className?: string;
  accentClassName?: string;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Símbolo Casas Milagres"
    >
      <path
        d="M10 38.5C16.8 25.8 23.9 19.5 32 19.5C40.1 19.5 47.2 25.8 54 38.5"
        stroke="currentColor"
        strokeWidth="4.4"
        strokeLinecap="round"
      />
      <path
        d="M18 38.5V50H46V38.5"
        stroke="currentColor"
        strokeWidth="4.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M24 50C28.6 44.7 35.4 44.7 40 50"
        stroke="currentColor"
        strokeWidth="4.4"
        strokeLinecap="round"
      />
      <path
        d="M20 13.5C24.4 9.6 29.8 7.9 35.9 8.8"
        className={accentClassName}
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M16 57.5C22.2 54.8 27.4 54.8 33.4 57.5C38.8 59.9 44.2 59.8 50 57.5"
        className={accentClassName}
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
