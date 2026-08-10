import { MapPin, Navigation } from "lucide-react";
import type { HouseLocation as HouseLocationData } from "@/types/house";
import {
  buildGoogleMapsEmbedUrl,
  buildGoogleMapsSearchUrl,
  buildWazeCoordinatesUrl,
  buildWazeSearchUrl,
} from "@/lib/maps";

type HouseLocationProps = {
  location: HouseLocationData;
  title: string;
};

export function HouseLocation({ location, title }: HouseLocationProps) {
  const query = location.mapQuery || location.address || location.label;
  const googleMapsUrl = location.googleMapsUrl || buildGoogleMapsSearchUrl(query);
  const wazeUrl =
    location.wazeUrl ||
    (typeof location.latitude === "number" && typeof location.longitude === "number"
      ? buildWazeCoordinatesUrl(location.latitude, location.longitude)
      : buildWazeSearchUrl(query));

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
      <div className="grid gap-3 border-t border-[var(--color-line)] px-4 py-3 sm:grid-cols-[1fr_auto] sm:items-center">
        <p className="flex gap-2 text-sm font-medium text-[var(--color-muted)]">
          <MapPin aria-hidden="true" className="mt-0.5 shrink-0 text-[var(--color-copper)]" size={16} />
          <span>{location.address || location.label}</span>
        </p>
        <div className="grid grid-cols-2 gap-2 sm:flex">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-10 items-center justify-center gap-2 border border-[var(--color-ocean)] px-3 text-sm font-semibold text-[var(--color-ocean)] transition hover:bg-[var(--color-ocean-strong)] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-gold)]"
          >
            <Navigation aria-hidden="true" size={15} />
            Google Maps
          </a>
          <a
            href={wazeUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-10 items-center justify-center gap-2 border border-[var(--color-copper)] px-3 text-sm font-semibold text-[var(--color-copper)] transition hover:bg-[var(--color-copper)] hover:text-[var(--color-ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-gold)]"
          >
            <Navigation aria-hidden="true" size={15} />
            Waze
          </a>
        </div>
      </div>
    </div>
  );
}
