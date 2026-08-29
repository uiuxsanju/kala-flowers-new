import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { formatINR, type Product } from "@/data/products";
import { useCart } from "@/lib/cart";
import { VegBadge } from "@/components/site/ProductCard";
import { Button } from "@/components/ui/button";

// ---------------------------------------------------------------------------
// Smooth, infinite, auto-scrolling product carousel for the homepage.
// The card list is rendered twice back-to-back and the track's scrollLeft is
// nudged forward a fraction of a pixel per animation frame; once it has
// scrolled past the first copy it snaps back by exactly one copy's width,
// which is invisible to the eye and gives a perfectly seamless loop without
// a dependency on any carousel library.
// ---------------------------------------------------------------------------

function CarouselCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const variant = product.variants[0] ?? { label: "250g", price: product.price };

  return (
    <article className="w-[74%] shrink-0 sm:w-[45%] md:w-[31%] lg:w-[23%]">
      <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-warm transition-shadow hover:shadow-lift">
        <Link
          to="/product/$productId"
          params={{ productId: product.id }}
          className="block aspect-[4/3] overflow-hidden bg-secondary"
          draggable={false}
        >
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            width={400}
            height={300}
            draggable={false}
            className="size-full object-cover"
          />
        </Link>
        <div className="flex flex-1 flex-col p-4">
          <div className="flex items-center gap-2">
            <VegBadge isVeg={product.isVeg} />
            <Link
              to="/product/$productId"
              params={{ productId: product.id }}
              className="line-clamp-1 font-display text-[15px] font-semibold hover:text-primary"
            >
              {product.name}
            </Link>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{variant.label}</p>
          <div className="mt-auto flex items-center justify-between gap-2 pt-3">
            <span className="font-display text-lg font-bold text-primary">
              {formatINR(variant.price)}
            </span>
            <Button
              size="sm"
              className="h-9 px-3"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addItem({
                  id: product.id,
                  name: product.name,
                  category: product.category,
                  isVeg: product.isVeg,
                  weight: variant.label,
                  price: variant.price,
                  qty: 1,
                });
                toast.success(`${product.name} (${variant.label}) × 1 added to cart`);
              }}
            >
              <ShoppingBag className="size-4" /> Add
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}

export function ProductCarousel({ products }: { products: Product[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || reduceMotion || products.length === 0) return;

    let raf: number;
    const SPEED = 0.45; // px per frame — slow, continuous drift

    const step = () => {
      if (!pausedRef.current) {
        track.scrollLeft += SPEED;
      }
      // Keep the scroll position wrapped within the first copy of the list on
      // every frame — not just while autoplay is running — so a manual arrow
      // click or a drag near either edge never leaves it stuck or jumps hard.
      const singleSetWidth = track.scrollWidth / 2;
      if (singleSetWidth > 0) {
        if (track.scrollLeft >= singleSetWidth) {
          track.scrollLeft -= singleSetWidth;
        } else if (track.scrollLeft < 0) {
          track.scrollLeft += singleSetWidth;
        }
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [reduceMotion, products]);

  const resumeAfterDelay = useCallback(() => {
    window.setTimeout(() => {
      pausedRef.current = false;
    }, 2200);
  }, []);

  const scrollByCard = useCallback(
    (dir: 1 | -1) => {
      const track = trackRef.current;
      if (!track) return;
      const card = track.querySelector("article");
      const width = card ? card.getBoundingClientRect().width + 16 : 300;
      pausedRef.current = true;
      track.scrollBy({ left: dir * width, behavior: "smooth" });
      resumeAfterDelay();
    },
    [resumeAfterDelay],
  );

  if (products.length === 0) return null;
  const looped = [...products, ...products];

  return (
    <div
      className="group/carousel relative"
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
      }}
      onTouchStart={() => {
        pausedRef.current = true;
      }}
      onTouchEnd={resumeAfterDelay}
    >
      <div
        ref={trackRef}
        className="flex gap-4 overflow-x-auto scroll-smooth pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {looped.map((p, i) => (
          <CarouselCard key={`${p.id}-${i}`} product={p} />
        ))}
      </div>

      <button
        type="button"
        aria-label="Scroll to previous products"
        onClick={() => scrollByCard(-1)}
        className="absolute left-0 top-[38%] hidden size-10 -translate-x-3 -translate-y-1/2 place-items-center rounded-full border border-border bg-card text-foreground shadow-lift transition-transform hover:scale-105 sm:grid"
      >
        <ChevronLeft className="size-5" />
      </button>
      <button
        type="button"
        aria-label="Scroll to next products"
        onClick={() => scrollByCard(1)}
        className="absolute right-0 top-[38%] hidden size-10 translate-x-3 -translate-y-1/2 place-items-center rounded-full border border-border bg-card text-foreground shadow-lift transition-transform hover:scale-105 sm:grid"
      >
        <ChevronRight className="size-5" />
      </button>
    </div>
  );
}
