import { useState } from "react";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { formatINR, type Product, type WeightVariant } from "@/data/products";
import { useCart } from "@/lib/cart";
import { VegBadge } from "@/components/site/ProductCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// The core product listing row, used on category, shop and search pages.
// Image-free by design — product information and shopping controls only.
// Nothing here navigates anywhere. The only interactive controls are:
// weight/size selection, quantity +/-, and Add to Cart.
// ---------------------------------------------------------------------------

export function ProductRow({ product }: { product: Product }) {
  const [variant, setVariant] = useState<WeightVariant>(
    product.variants[0] ?? { label: "250g", price: product.price },
  );
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();

  const handleAdd = () => {
    addItem({
      id: product.id,
      name: product.name,
      category: product.category,
      isVeg: product.isVeg,
      weight: variant.label,
      price: variant.price,
      qty,
    });
    toast.success(`${product.name} (${variant.label}) × ${qty} added to cart`);
    setQty(1);
  };

  return (
    <article className="flex flex-col gap-3 rounded-xl border border-border bg-card p-3.5 shadow-warm transition-shadow hover:shadow-lift sm:flex-row sm:items-center sm:gap-5 sm:p-5">
      {/* Identity: name + meta (no links, no click behaviour, no image) */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <VegBadge isVeg={product.isVeg} />
          <span className="font-display text-[15px] font-semibold leading-snug">
            {product.name}
          </span>
          {product.bestseller && (
            <span className="rounded-full bg-gold-gradient px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gold-foreground">
              Bestseller
            </span>
          )}
          {!product.inStock && (
            <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Sold out
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground/80">{product.nameTelugu}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{variant.label}</p>
        <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
          {product.shortDescription}
        </p>

        {product.variants.length > 1 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {product.variants.map((w) => (
              <button
                key={w.label}
                type="button"
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
        )}
      </div>

      {/* Price + quantity + add-to-cart */}
      <div className="flex items-center justify-between gap-2 border-t border-border pt-3 sm:justify-end sm:gap-5 sm:border-t-0 sm:pt-0">
        <div className="flex shrink-0 flex-col items-start sm:w-20 sm:items-end">
          <span className="font-display text-base font-bold text-primary sm:text-lg">
            {formatINR(variant.price)}
          </span>
          {product.originalPrice && variant.label === product.variants[0]?.label && (
            <span className="text-xs text-muted-foreground line-through">
              {formatINR(product.originalPrice)}
            </span>
          )}
        </div>

        <div className="flex shrink-0 items-center rounded-full border border-border">
          <button
            type="button"
            aria-label="Decrease quantity"
            className="grid size-9 place-items-center text-muted-foreground hover:text-primary disabled:opacity-40"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={!product.inStock}
          >
            <Minus className="size-3.5" />
          </button>
          <span className="w-5 text-center text-sm font-semibold">{qty}</span>
          <button
            type="button"
            aria-label="Increase quantity"
            className="grid size-9 place-items-center text-muted-foreground hover:text-primary disabled:opacity-40"
            onClick={() => setQty((q) => q + 1)}
            disabled={!product.inStock}
          >
            <Plus className="size-3.5" />
          </button>
        </div>

        <Button
          type="button"
          size="sm"
          className="h-9 shrink-0 px-3"
          disabled={!product.inStock}
          onClick={handleAdd}
        >
          <ShoppingBag className="size-4" />
          <span className="hidden sm:inline">{product.inStock ? "Add to Cart" : "Sold out"}</span>
          <span className="sm:hidden">{product.inStock ? "Add" : "Sold out"}</span>
        </Button>
      </div>
    </article>
  );
}

export function ProductRowSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 sm:p-5">
      <div className="flex-1 space-y-2">
        <div className="h-4 w-1/3 animate-pulse rounded bg-secondary" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-secondary" />
      </div>
      <div className="h-8 w-24 animate-pulse rounded-full bg-secondary" />
    </div>
  );
}