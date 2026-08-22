import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { formatINR, type Product } from "@/data/products";
import { useCart } from "@/lib/cart";
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
  const [variant, setVariant] = useState(product.variants[0]);
  const { addItem, setOpen } = useCart();

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
        {product.bestseller && (
          <span className="absolute left-3 top-3 rounded-full bg-gold-gradient px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-gold-foreground">
            Bestseller
          </span>
        )}
        {!product.inStock && (
          <span className="absolute inset-0 grid place-items-center bg-maroon-deep/60 font-display text-sm font-semibold uppercase tracking-widest text-primary-foreground">
            Sold out
          </span>
        )}
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
        <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground">{product.description}</p>

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
          <span className="font-display text-lg font-bold text-primary">{formatINR(variant.price)}</span>
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
