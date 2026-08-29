import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import heroImg from "@/assets/hero-pickles.webp";
import posterImg from "@/assets/brand/kala-flavours-poster.jpg";
import portraitImg from "@/assets/brand/kala-flavours-portrait.jpg";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Hero carousel. Each slide keeps its own true aspect ratio via object-contain
// (nothing is ever cropped or has text cut off), sitting inside a shared
// widescreen frame filled with a warm maroon gradient + kolam dot texture so
// the letterbox area around square/portrait slides reads as an intentional
// framed-poster look rather than empty bars.
// ---------------------------------------------------------------------------

const SLIDES = [
  {
    src: posterImg,
    alt: "Kala Flavours — Traditional Andhra Pickles, made with love, served with pride",
  },
  {
    src: heroImg,
    alt: "Assorted Andhra pickles in glass jars with fresh spices",
  },
  {
    src: portraitImg,
    alt: "Kala Flavours — homemade foods, homemade with love",
  },
];

const AUTO_SLIDE_MS = 5000;

export function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const pausedRef = useRef(false);

  const goTo = useCallback((i: number) => {
    setIndex((prev) => {
      const next = (i + SLIDES.length) % SLIDES.length;
      return next === prev ? prev : next;
    });
  }, []);

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  // Auto-slide, paused while the user is interacting (hover / touch).
  useEffect(() => {
    const id = window.setInterval(() => {
      if (!pausedRef.current) setIndex((i) => (i + 1) % SLIDES.length);
    }, AUTO_SLIDE_MS);
    return () => window.clearInterval(id);
  }, []);

  const resumeSoon = () => {
    window.setTimeout(() => {
      pausedRef.current = false;
    }, 3000);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    pausedRef.current = true;
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current !== null) {
      const dx = (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
      if (Math.abs(dx) > 40) (dx < 0 ? next : prev)();
      touchStartX.current = null;
    }
    resumeSoon();
  };

  return (
    <div
      className="relative w-full touch-pan-y select-none overflow-hidden rounded-2xl border border-primary-foreground/15 shadow-lift"
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="relative aspect-video w-full bg-hero-gradient">
        <span className="kolam-strip absolute inset-0 text-primary-foreground" aria-hidden="true" />
        {SLIDES.map((slide, i) => (
          <img
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            width={1280}
            height={720}
            loading={i === 0 ? "eager" : "lazy"}
            draggable={false}
            className={cn(
              "absolute inset-0 size-full object-contain transition-opacity duration-700 ease-in-out",
              i === index ? "opacity-100" : "pointer-events-none opacity-0",
            )}
          />
        ))}
      </div>

      <button
        type="button"
        aria-label="Previous slide"
        onClick={() => {
          prev();
          pausedRef.current = true;
          resumeSoon();
        }}
        className="absolute left-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-black/35 text-white backdrop-blur-sm transition-colors hover:bg-black/55 sm:left-3"
      >
        <ChevronLeft className="size-5" />
      </button>
      <button
        type="button"
        aria-label="Next slide"
        onClick={() => {
          next();
          pausedRef.current = true;
          resumeSoon();
        }}
        className="absolute right-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-black/35 text-white backdrop-blur-sm transition-colors hover:bg-black/55 sm:right-3"
      >
        <ChevronRight className="size-5" />
      </button>

      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => {
              goTo(i);
              pausedRef.current = true;
              resumeSoon();
            }}
            className={cn(
              "h-2 rounded-full shadow-sm transition-all",
              i === index ? "w-6 bg-white" : "w-2 bg-white/55 hover:bg-white/80",
            )}
          />
        ))}
      </div>
    </div>
  );
}