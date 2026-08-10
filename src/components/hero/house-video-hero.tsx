import Image from "next/image";
import type { ReactNode } from "react";
import type { House } from "@/types/house";

type HouseVideoHeroProps = {
  house: House;
  children: ReactNode;
};

export function HouseVideoHero({ house, children }: HouseVideoHeroProps) {
  const video = house.hero.type === "video" ? house.hero.video : undefined;
  const poster = video?.poster || house.hero.image || house.images[0].src;

  return (
    <section
      id="inicio"
      className="section-anchor relative min-h-[62svh] overflow-hidden bg-[var(--color-ocean-strong)] text-white"
    >
      {video ? (
        <>
          <video
            className="absolute inset-0 hidden size-full object-cover motion-safe:block"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={poster}
            aria-hidden="true"
          >
            {video.webm ? <source src={video.webm} type="video/webm" /> : null}
            {video.mp4 ? <source src={video.mp4} type="video/mp4" /> : null}
          </video>
          <Image
            src={poster}
            alt={house.images[0].alt}
            fill
            priority
            sizes="100vw"
            className="object-cover motion-safe:hidden"
          />
        </>
      ) : (
        <Image
          src={poster}
          alt={house.images[0].alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      )}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(1,72,75,0.82),rgba(2,109,112,0.42),rgba(2,150,154,0.18))]" />
      <div className="relative mx-auto flex min-h-[62svh] max-w-7xl items-end px-4 pb-8 pt-24 md:px-6 md:pb-10 xl:px-8">
        {children}
      </div>
    </section>
  );
}
