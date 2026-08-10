"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/format";

export function FloatingWhatsApp() {
  const pathname = usePathname();
  const [heroVisible, setHeroVisible] = useState(false);
  const [consultVisible, setConsultVisible] = useState(false);
  const consultHref = pathname.startsWith("/casas/")
    ? `${pathname}#consultar`
    : "/#consultar";
  const hideMobileBar = heroVisible || consultVisible;

  useEffect(() => {
    const hero = document.getElementById("inicio");
    const consult = document.getElementById("consultar");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.target.id === "inicio") setHeroVisible(entry.isIntersecting);
          if (entry.target.id === "consultar") setConsultVisible(entry.isIntersecting);
        }
      },
      { threshold: 0.18 },
    );

    if (hero) observer.observe(hero);
    if (consult) observer.observe(consult);
    return () => observer.disconnect();
  }, [pathname]);

  return (
    <>
      <Link
        href={consultHref}
        aria-label="Consultar disponibilidade"
        className="fixed bottom-5 right-5 z-40 hidden size-12 place-items-center rounded-full bg-[var(--color-ocean-strong)] text-white shadow-lg transition hover:-translate-y-1 hover:bg-[var(--color-copper)] hover:text-[var(--color-ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-gold)] md:grid"
      >
        <MessageCircle aria-hidden="true" size={22} />
      </Link>
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-40 border-t border-[var(--color-line)] bg-[var(--color-shell)]/96 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-12px_35px_rgba(23,35,34,0.10)] backdrop-blur transition md:hidden",
          hideMobileBar && "pointer-events-none translate-y-full opacity-0",
        )}
      >
        <Link
          href={consultHref}
          className="flex min-h-12 items-center justify-center gap-2 rounded-sm bg-[var(--color-ocean-strong)] px-5 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold)]"
        >
          <MessageCircle aria-hidden="true" size={18} />
          Consultar disponibilidade
        </Link>
      </div>
    </>
  );
}
