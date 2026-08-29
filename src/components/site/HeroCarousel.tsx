import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import heroImg from "@/assets/hero-pickles.webp";
import posterImg from "@/assets/brand/kala-flavours-poster.jpg";
import logoImg from "@/assets/brand/kala-flavours-logo.jpg";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Hero carousel — uses ONLY the three real brand images already in the
// project (no generated/stock photos): the existing hero photo, the new
// Kala Flavours poster, and the brand logo photo. Every slide is cropped
// with object-fit: cover inside an identical, fixed-aspect frame so nothing
// stretches or distorts — only object-position changes per image to keep
// the jar/product/portrait centred in frame.
// ---------------------------------------------------------------------------

const SLIDES = [
  {
    src: heroImg,
    alt: "Assorted Andhra pickles in glass jars with fresh spices",
    position: "center",
  },
  {
    src: posterImg,
    alt: "Kala Flavours — traditional Andhra pickles, homemade with love",
    position: "center",
  },
  {
    src: logoImg,
    alt: "Kala Flavours — homemade foods",
    position: "center 28%",
  },
];

const AUTO_SLIDE_MS = 4500;

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
      className="relative w-full touch-pan-y select-none overflow-hidden rounded-2xl shadow-lift"
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="relative aspect-[4/3] w-full">
        {SLIDES.map((slide, i) => (
          <img
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            width={1200}
            height={900}
            loading={i === 0 ? "eager" : "lazy"}
            draggable={false}
            style={{ objectPosition: slide.position }}
            className={cn(
              "absolute inset-0 size-full object-cover transition-opacity duration-700 ease-in-out",
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
