import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { toast } from "sonner";
import { formatINR, type Product, type WeightVariant } from "@/data/products";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function VegBadge({ isVeg }: { isVeg: boolean }) {
  return (
    <span
      title={isVeg ? "Vegetarian" : "Non-vegetarian"}
      className={cn(
        "grid size-4 shrink-0 place-items-center rounded-[3px] border",
        isVeg ? "border-veg" : "border-nonveg",
      )}
    >
      <span className={cn("size-2 rounded-full", isVeg ? "bg-veg" : "bg-nonveg")} />
    </span>
  );
}

export function RatingStars({ rating, reviewCount }: { rating: number; reviewCount?: number }) {
  return (
    <span className="flex items-center gap-1 text-xs text-muted-foreground">
      <Star className="size-3 fill-accent text-accent" />
      <span className="font-medium text-foreground">{rating.toFixed(1)}</span>
      {reviewCount !== undefined && <span>({reviewCount})</span>}
    </span>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const [variant, setVariant] = useState<WeightVariant>(
    product.variants[0] ?? { label: "250g", price: product.price },
  );
  const { addItem, setOpen } = useCart();
  const { isWishlisted, toggle } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  return (
    <article className="card-lift group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-warm">
      <Link
        to="/product/$productId"
        params={{ productId: product.id }}
        className="relative block aspect-square overflow-hidden bg-secondary"
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width={800}
          height={800}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.bestseller && (
            <span className="rounded-full bg-gold-gradient px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-gold-foreground">
              Bestseller
            </span>
          )}
          {product.discount && (
            <span className="rounded-full bg-primary px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-primary-foreground">
              {product.discount}% off
            </span>
          )}
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            toggle(product.id);
          }}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wishlisted}
          className={cn(
            "absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-card/90 shadow-warm transition-opacity",
            wishlisted
              ? "opacity-100"
              : "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100",
          )}
        >
          <Heart
            className={cn(
              "size-4",
              wishlisted ? "fill-primary text-primary" : "text-muted-foreground",
            )}
          />
        </button>
        {!product.inStock && (
          <span className="absolute inset-0 grid place-items-center bg-maroon-deep/60 font-display text-sm font-semibold uppercase tracking-widest text-primary-foreground">
            Sold out
          </span>
        )}
        <span className="absolute inset-x-0 bottom-0 translate-y-full bg-primary py-2 text-center text-xs font-semibold uppercase tracking-widest text-primary-foreground transition-transform duration-300 group-hover:translate-y-0">
          Quick view
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start gap-2">
          <VegBadge isVeg={product.isVeg} />
          <Link
            to="/product/$productId"
            params={{ productId: product.id }}
            className="font-display text-[15px] font-semibold leading-snug hover:text-primary"
          >
            {product.name}
          </Link>
        </div>
        <div className="mt-1.5 flex items-center gap-2">
          <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
        </div>
        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
          {product.shortDescription}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {product.variants.map((w) => (
            <button
              key={w.label}
              onClick={() => setVariant(w)}
              className={cn(
                "rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors",
                variant.label === w.label
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-primary",
              )}
            >
              {w.label}
            </button>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 pt-4">
          <span className="flex flex-col">
            <span className="font-display text-lg font-bold text-primary">
              {formatINR(variant.price)}
            </span>
            {product.discount && (
              <span className="text-xs text-muted-foreground line-through">
                {formatINR(product.originalPrice ?? 0)}
              </span>
            )}
          </span>
          <Button
            size="sm"
            disabled={!product.inStock}
            onClick={() => {
              addItem({
                id: product.id,
                name: product.name,
                weight: variant.label,
                price: variant.price,
                qty: 1,
                image: product.image,
              });
              toast.success(`${product.name} (${variant.label}) added`);
              setOpen(true);
            }}
          >
            <ShoppingBag className="size-4" /> Add
          </Button>
        </div>
      </div>
    </article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="aspect-square animate-pulse bg-secondary" />
      <div className="space-y-2 p-4">
        <div className="h-4 w-3/4 animate-pulse rounded bg-secondary" />
        <div className="h-3 w-full animate-pulse rounded bg-secondary" />
        <div className="h-8 w-full animate-pulse rounded bg-secondary" />
      </div>
    </div>
  );
}
