import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, ShoppingBag } from "lucide-react";
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

export function ProductCard({ product }: { product: Product }) {
  const [variant, setVariant] = useState<WeightVariant>(
    product.variants[0] ?? { label: "250g", price: product.price },
  );
  const { addItem } = useCart();
  const { isWishlisted, toggle } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  return (
    <article className="card-lift group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-warm">
      <Link
        to="/product/$productId"
        params={{ productId: product.id }}
        className="relative block aspect-[4/3] overflow-hidden bg-secondary"
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width={480}
          height={360}
          className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/40 via-black/10 to-transparent"
        />
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.bestseller && (
            <span className="rounded-full bg-gold-gradient px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-gold-foreground shadow-warm">
              Bestseller
            </span>
          )}
          {product.discount && (
            <span className="rounded-full bg-primary px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-primary-foreground shadow-warm">
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
            "absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-card/90 shadow-warm backdrop-blur-sm transition-opacity",
            wishlisted
              ? "opacity-100"
              : "opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100",
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
          <span className="absolute inset-0 grid place-items-center bg-maroon-deep/70 font-display text-sm font-semibold uppercase tracking-widest text-primary-foreground">
            Sold out
          </span>
        )}
      </Link>
      <div aria-hidden="true" className="leaf-divider -mt-[1px] text-border/50" />

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <div className="flex items-start gap-2">
          <VegBadge isVeg={product.isVeg} />
          <div className="min-w-0">
            <Link
              to="/product/$productId"
              params={{ productId: product.id }}
              className="font-display text-[15px] font-semibold leading-snug hover:text-primary"
            >
              {product.name} <span className="font-normal">({product.nameTelugu})</span>
            </Link>
          </div>
        </div>
        <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground">
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
            <span className="font-sans text-lg font-semibold text-foreground">
              {formatINR(variant.price)}
            </span>
            {product.discount && (
              <span className="font-sans text-xs text-muted-foreground line-through">
                {formatINR(product.originalPrice ?? 0)}
              </span>
            )}
          </span>
          <Button
            size="sm"
            disabled={!product.inStock}
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
    </article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="aspect-[4/3] animate-pulse bg-secondary" />
      <div className="space-y-2 p-4">
        <div className="h-4 w-3/4 animate-pulse rounded bg-secondary" />
        <div className="h-3 w-full animate-pulse rounded bg-secondary" />
        <div className="h-8 w-full animate-pulse rounded bg-secondary" />
      </div>
    </div>
  );
}