"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, MessageCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/logo";
import { navItems } from "@/data/site-config";
import { cn } from "@/lib/format";

export function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("inicio");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const visibleActiveSection =
    pathname === "/" ? activeSection : pathname.startsWith("/contato") ? "contato" : "";

  useEffect(() => {
    if (pathname !== "/") return;

    const sections = navItems
      .map((item) => item.id)
      .filter(Boolean)
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveSection(visible.target.id);
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0.12, 0.25, 0.5] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  const transparentTop =
    pathname === "/" || pathname.startsWith("/contato") || pathname.startsWith("/casas/");
  const solid = scrolled || isOpen || !transparentTop;
  const hideHomeTopLogo = pathname === "/" && !solid;
  const consultHref = pathname.startsWith("/casas/")
    ? `${pathname}#consultar`
    : "/#consultar";

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition duration-300",
        solid
          ? "border-b border-[var(--color-line)] bg-[var(--color-shell)]/88 shadow-[0_10px_30px_rgba(23,35,34,0.08)] backdrop-blur-xl"
          : "bg-gradient-to-b from-black/24 to-transparent",
      )}
    >
      <div className="mx-auto grid h-20 max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 md:px-6 xl:px-8">
        <Link
          href="/#inicio"
          className={cn(
            "justify-self-start rounded-sm transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-gold)]",
            hideHomeTopLogo && "pointer-events-none opacity-0",
          )}
          aria-label="Casas Milagres - início"
          aria-hidden={hideHomeTopLogo}
          tabIndex={hideHomeTopLogo ? -1 : undefined}
          onClick={() => setIsOpen(false)}
        >
          <Logo variant={solid ? "dark" : "light"} size="md" />
        </Link>

        <nav className="hidden items-center justify-center gap-7 lg:flex" aria-label="Principal">
          {navItems.map((item) => {
            const isActive = visibleActiveSection === item.id;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-gold)]",
                  solid
                    ? "text-[var(--color-ink)] hover:text-[var(--color-copper)]"
                    : "text-white/88 hover:text-white",
                )}
              >
                {item.label}
                <span
                  className={cn(
                    "absolute -bottom-2 left-0 h-px transition-all",
                    solid ? "bg-[var(--color-copper)]" : "bg-[var(--color-gold)]",
                    isActive ? "w-full" : "w-0",
                  )}
                />
              </Link>
            );
          })}
        </nav>

        <Link
          href={consultHref}
          className={cn(
            "hidden min-h-11 items-center justify-center rounded-sm px-4 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-gold)] md:inline-flex md:justify-self-end",
            solid
              ? "bg-[var(--color-ocean-strong)] text-white hover:bg-[var(--color-copper)] hover:text-[var(--color-ink)]"
              : "border border-white/55 bg-white/10 text-white backdrop-blur hover:bg-white hover:text-[var(--color-ink)]",
          )}
        >
          Consultar disponibilidade
        </Link>

        <button
          type="button"
          className={cn(
            "col-start-3 grid size-11 place-items-center justify-self-end rounded-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-gold)] lg:hidden",
            solid ? "text-[var(--color-ink)]" : "text-white",
          )}
          onClick={() => setIsOpen((value) => !value)}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
        >
          {isOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>

      <div
        id="mobile-menu"
        className={cn(
          "fixed inset-x-0 top-20 z-50 h-[calc(100svh-5rem)] bg-[var(--color-ocean-strong)] text-white transition duration-300 lg:hidden",
          isOpen
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-4 opacity-0",
        )}
      >
        <div className="flex h-full flex-col justify-between px-5 py-7">
          <div>
            <Logo variant="light" showSignature size="md" />
            <nav className="mt-10 grid gap-2" aria-label="Mobile">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex min-h-14 items-center justify-between border-b border-white/12 text-lg font-medium text-white/88 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-gold)]"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                  <span className="text-[var(--color-gold)]">→</span>
                </Link>
              ))}
            </nav>
          </div>
          <Link
            href={consultHref}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-sm bg-[var(--color-gold)] px-5 text-sm font-semibold text-[var(--color-ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            onClick={() => setIsOpen(false)}
          >
            <MessageCircle aria-hidden="true" size={18} />
            Consultar disponibilidade
          </Link>
        </div>
      </div>
    </header>
  );
}
