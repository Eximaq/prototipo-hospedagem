import { Navigation } from "lucide-react";
import { buildGoogleMapsEmbedUrl, buildGoogleMapsSearchUrl } from "@/lib/maps";

type GoogleMapProps = {
  query: string;
  title: string;
};

export function GoogleMap({ query, title }: GoogleMapProps) {
  return (
    <div className="overflow-hidden border border-[var(--color-line)] bg-[var(--color-shell)] shadow-[0_18px_45px_rgba(23,35,34,0.08)]">
      <iframe
        src={buildGoogleMapsEmbedUrl(query)}
        title={title}
        className="h-72 w-full border-0 md:h-80"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
      <div className="flex items-center justify-between gap-4 border-t border-[var(--color-line)] px-4 py-3">
        <p className="text-sm font-medium text-[var(--color-muted)]">{query}</p>
        <a
          href={buildGoogleMapsSearchUrl(query)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 border border-[var(--color-ocean)] px-3 text-sm font-semibold text-[var(--color-ocean)] transition hover:bg-[var(--color-ocean)] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-gold)]"
        >
          <Navigation aria-hidden="true" size={15} />
          Abrir
        </a>
      </div>
    </div>
  );
}
