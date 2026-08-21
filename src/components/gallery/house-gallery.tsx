"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { HouseImage } from "@/types/house";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/format";

type HouseGalleryProps = {
  images: HouseImage[];
  label: string;
  compact?: boolean;
};

export function HouseGallery({ images, label, compact = false }: HouseGalleryProps) {
  const [index, setIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const touchStart = useRef<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  const current = images[index];
  const total = images.length;

  const goTo = useCallback(
    (nextIndex: number) => {
      setIndex((nextIndex + total) % total);
    },
    [total],
  );

  const next = useCallback(() => {
    setIndex((currentIndex) => (currentIndex + 1) % total);
  }, [total]);

  const previous = useCallback(() => {
    setIndex((currentIndex) => (currentIndex - 1 + total) % total);
  }, [total]);

  function onTouchStart(clientX: number) {
    touchStart.current = clientX;
  }

  function onTouchEnd(clientX: number) {
    if (touchStart.current === null) return;
    const delta = touchStart.current - clientX;
    touchStart.current = null;
    if (Math.abs(delta) < 42) return;
    if (delta > 0) next();
    else previous();
  }

  function openLightbox() {
    trackEvent("open_gallery", { label, imageIndex: index + 1 });
    setLightboxOpen(true);
  }

  useEffect(() => {
    if (!lightboxOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    queueMicrotask(() => closeButtonRef.current?.focus());

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightboxOpen(false);
      if (event.key === "ArrowRight") next();
      if (event.key === "ArrowLeft") previous();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [lightboxOpen, next, previous]);

  return (
    <>
      <div className="grid gap-2">
        <div
          className={cn(
            "group relative overflow-hidden bg-[var(--color-ocean-strong)]",
            compact ? "aspect-[4/5] sm:aspect-square" : "aspect-[4/5] md:aspect-[16/11]",
          )}
          onTouchStart={(event) => onTouchStart(event.changedTouches[0].clientX)}
          onTouchEnd={(event) => onTouchEnd(event.changedTouches[0].clientX)}
        >
          <button
            type="button"
            onClick={openLightbox}
            className="absolute inset-0 z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[var(--color-gold)]"
            aria-label={`Abrir galeria de ${label}`}
          >
            <span className="sr-only">Abrir imagem em tela cheia</span>
          </button>
          <div
            className="flex h-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {images.map((image) => (
              <div className="relative h-full min-w-full" key={image.src}>
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes={
                    compact
                      ? "(min-width: 1024px) 42vw, (min-width: 768px) 50vw, 100vw"
                      : "(min-width: 1024px) 48vw, 100vw"
                  }
                  className="object-cover"
                />
              </div>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(2,150,154,0.03),rgba(1,72,75,0.24))]" />
          <div className="absolute right-3 top-3 z-20 rounded-full bg-black/45 px-3 py-1 text-[0.68rem] font-semibold text-white backdrop-blur">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </div>
          <button
            type="button"
            onClick={openLightbox}
            className="absolute bottom-3 right-3 z-20 inline-flex min-h-9 items-center gap-2 rounded-full bg-white/90 px-3 text-xs font-semibold text-[var(--color-ink)] transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-gold)]"
            aria-label={`Ver todas as fotos de ${label}`}
          >
            <Maximize2 aria-hidden="true" size={17} />
            <span className="hidden sm:inline">Ver todas as fotos</span>
          </button>
          <GalleryArrow
            direction="previous"
            onClick={previous}
            label={`Imagem anterior de ${label}`}
          />
          <GalleryArrow
            direction="next"
            onClick={next}
            label={`Próxima imagem de ${label}`}
          />
        </div>

        <div
          className="flex items-center justify-center gap-1.5"
          aria-label="Indicadores da galeria"
        >
          {images.map((image, imageIndex) => (
            <button
              type="button"
              key={image.src}
              onClick={() => goTo(imageIndex)}
              className={cn(
                "h-1.5 rounded-full transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-gold)]",
                imageIndex === index
                  ? "w-7 bg-[var(--color-copper)]"
                  : "w-2 bg-[var(--color-line)]",
              )}
              aria-label={`Ir para imagem ${imageIndex + 1}`}
            />
          ))}
        </div>
      </div>

      {lightboxOpen ? (
        <div
          className="fixed inset-0 z-[80] bg-[#071b1f]/96 text-white"
          role="dialog"
          aria-modal="true"
          aria-label={`Galeria de ${label}`}
          onTouchStart={(event) => onTouchStart(event.changedTouches[0].clientX)}
          onTouchEnd={(event) => onTouchEnd(event.changedTouches[0].clientX)}
        >
          <button
            ref={closeButtonRef}
            type="button"
            className="absolute right-5 top-5 z-20 grid size-11 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-gold)]"
            onClick={() => setLightboxOpen(false)}
            aria-label="Fechar galeria"
          >
            <X aria-hidden="true" />
          </button>
          <div className="absolute left-5 top-5 z-20 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </div>
          <div className="relative flex h-full items-center justify-center p-5 md:p-10">
            <div className="relative h-[76svh] w-full max-w-6xl">
              <Image
                key={`lightbox-${current.src}`}
                src={current.src}
                alt={current.alt}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
          </div>
          <LightboxArrow direction="previous" onClick={previous} />
          <LightboxArrow direction="next" onClick={next} />
        </div>
      ) : null}
    </>
  );
}

function GalleryArrow({
  direction,
  onClick,
  label,
}: {
  direction: "previous" | "next";
  onClick: () => void;
  label: string;
}) {
  const isPrevious = direction === "previous";
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "absolute top-1/2 z-20 hidden size-10 -translate-y-1/2 place-items-center rounded-full bg-white/88 text-[var(--color-ink)] shadow-sm transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-gold)] md:grid",
        isPrevious ? "left-4" : "right-4",
      )}
      aria-label={label}
    >
      {isPrevious ? (
        <ChevronLeft aria-hidden="true" />
      ) : (
        <ChevronRight aria-hidden="true" />
      )}
    </button>
  );
}

function LightboxArrow({
  direction,
  onClick,
}: {
  direction: "previous" | "next";
  onClick: () => void;
}) {
  const isPrevious = direction === "previous";
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "absolute top-1/2 z-20 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-gold)]",
        isPrevious ? "left-4 md:left-8" : "right-4 md:right-8",
      )}
      aria-label={isPrevious ? "Imagem anterior" : "Próxima imagem"}
    >
      {isPrevious ? (
        <ChevronLeft aria-hidden="true" />
      ) : (
        <ChevronRight aria-hidden="true" />
      )}
    </button>
  );
}
