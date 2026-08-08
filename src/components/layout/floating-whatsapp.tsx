"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";

export function FloatingWhatsApp() {
  return (
    <>
      <Link
        href="/#consultar"
        aria-label="Consultar disponibilidade"
        className="fixed bottom-5 right-5 z-40 hidden size-12 place-items-center rounded-full bg-[var(--color-ocean-strong)] text-white shadow-lg transition hover:-translate-y-1 hover:bg-[var(--color-copper)] hover:text-[var(--color-ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-gold)] md:grid"
      >
        <MessageCircle aria-hidden="true" size={22} />
      </Link>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--color-line)] bg-[var(--color-shell)]/96 p-3 shadow-[0_-12px_35px_rgba(23,35,34,0.10)] backdrop-blur md:hidden">
        <Link
          href="/#consultar"
          className="flex min-h-12 items-center justify-center gap-2 rounded-sm bg-[var(--color-ocean-strong)] px-5 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold)]"
        >
          <MessageCircle aria-hidden="true" size={18} />
          Consultar disponibilidade
        </Link>
      </div>
    </>
  );
}
