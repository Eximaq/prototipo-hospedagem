"use client";

import Link from "next/link";
import { useEffect } from "react";

type StaticRedirectProps = {
  href: string;
  label?: string;
};

export function StaticRedirect({
  href,
  label = "Continuar",
}: StaticRedirectProps) {
  useEffect(() => {
    window.location.replace(href);
  }, [href]);

  return (
    <div className="grid min-h-svh place-items-center bg-[var(--color-paper)] px-4 text-center">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-copper)]">
          Redirecionando
        </p>
        <h1 className="mt-3 font-serif text-4xl text-[var(--color-ink)]">
          Esta página mudou de endereço.
        </h1>
        <Link
          href={href}
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-sm bg-[var(--color-ocean-strong)] px-5 text-sm font-semibold text-white transition hover:bg-[var(--color-copper)] hover:text-[var(--color-ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-gold)]"
        >
          {label}
        </Link>
      </div>
    </div>
  );
}
