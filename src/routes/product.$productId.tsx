import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Minus, Plus, ShoppingBag, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { formatINR, getCategory, getProduct, productsByCategory, WHATSAPP_NUMBER } from "@/data/products";
import { ProductCard, VegBadge } from "@/components/site/ProductCard";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/product/$productId")({
  loader: ({ params }) => {
    const product = getProduct(params.productId);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Product not found — Kala Flavours" }, { name: "robots", content: "noindex" }] };
    }
    const { product } = loaderData;
    const title = `${product.name} — Kala Flavours`;
    return {
      meta: [
        { title },
        { name: "description", content: product.description },
        { property: "og:title", content: title },
        { property: "og:description", content: product.description },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const category = getCategory(product.category);
  const { addItem, setOpen } = useCart();
  const [variant, setVariant] = useState(
    product.variants[0] ?? { label: "250g", price: product.price },
  );
  const [qty, setQty] = useState(1);
  const related = productsByCategory(product.category)
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hi Kala Flavours, I'd like to order ${product.name} (${variant.label}) x ${qty}.`,
  )}`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <nav className="text-xs text-muted-foreground">
        <Link to="/" className="hover:text-primary">
          Home
        </Link>
        {category && (
          <>
            {" / "}
            <Link
              to="/category/$categorySlug"
              params={{ categorySlug: category.slug }}
              className="hover:text-primary"
            >
              {category.name}
            </Link>
          </>
        )}
        {" / "}
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <div>
          <img
            src={product.image}
            alt={product.name}
            width={900}
            height={900}
            className="w-full rounded-2xl border border-border object-cover shadow-warm"
          />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <VegBadge isVeg={product.isVeg} />
            <span className="text-xs uppercase tracking-widest text-muted-foreground">
              {category?.name}
            </span>
          </div>
          <h1 className="mt-2 font-display text-3xl font-bold">{product.name}</h1>
          <p className="mt-3 text-muted-foreground">{product.description}</p>

          <p className="mt-5 font-display text-3xl font-bold text-primary">
            {formatINR(variant.price)}
          </p>

          <div className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Pack size
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.variants.map((v) => (
                <button
                  key={v.label}
                  onClick={() => setVariant(v)}
                  className={
                    v.label === variant.label
                      ? "rounded-full border border-primary bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground"
                      : "rounded-full border border-border px-4 py-1.5 text-sm font-medium text-muted-foreground hover:border-primary"
                  }
                >
                  {v.label} · {formatINR(v.price)}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-full border border-border">
              <button
                aria-label="Decrease quantity"
                className="grid size-9 place-items-center text-muted-foreground hover:text-primary"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
              >
                <Minus className="size-4" />
              </button>
              <span className="w-8 text-center font-semibold">{qty}</span>
              <button
                aria-label="Increase quantity"
                className="grid size-9 place-items-center text-muted-foreground hover:text-primary"
                onClick={() => setQty((q) => q + 1)}
              >
                <Plus className="size-4" />
              </button>
            </div>
            <Button
              disabled={!product.inStock}
              onClick={() => {
                addItem({
                  id: product.id,
                  name: product.name,
                  weight: variant.label,
                  price: variant.price,
                  qty,
                  image: product.image,
                });
                toast.success(`${product.name} (${variant.label}) added`);
                setOpen(true);
              }}
            >
              <ShoppingBag className="size-4" /> {product.inStock ? "Add to basket" : "Sold out"}
            </Button>
            <Button variant="gold" asChild>
              <a href={waUrl} target="_blank" rel="noreferrer">
                <MessageCircle className="size-4" /> Order on WhatsApp
              </a>
            </Button>
          </div>

          <div className="mt-8 rounded-xl border border-border bg-card p-5">
            <p className="font-display text-base font-semibold">Ingredients</p>
            <p className="mt-1 text-sm text-muted-foreground">{product.ingredients}</p>
            <p className="mt-4 font-display text-base font-semibold">Shelf life & storage</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Best within 12 months. Use a dry spoon, keep the jar closed and store away from
              sunlight.
            </p>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <div className="leaf-divider mb-8" />
          <h2 className="font-display text-2xl font-bold">You may also like</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
