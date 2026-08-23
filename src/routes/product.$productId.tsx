import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import {
  Award,
  Leaf,
  Minus,
  Package,
  Plus,
  ShieldCheck,
  ShoppingBag,
  MessageCircle,
} from "lucide-react";
import { toast } from "sonner";
import { formatINR, getCategory, getProduct, productsByCategory } from "@/data/products";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { ProductCard, RatingStars, VegBadge } from "@/components/site/ProductCard";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/product/$productId")({
  loader: ({ params }) => {
    const product = getProduct(params.productId);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Product not found — PickleMart" }, { name: "robots", content: "noindex" }],
      };
    }
    const { product } = loaderData;
    const title = `${product.name} — PickleMart`;
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

// small helper kept local to avoid importing notFound twice in the same import line

const benefits = [
  { icon: Award, title: "Authentic Recipe", text: "Made the traditional Andhra way." },
  { icon: Leaf, title: "Quality Ingredients", text: "No shortcuts, no fillers." },
  { icon: Package, title: "Freshly Packed", text: "Cooked and packed the same week." },
  { icon: ShieldCheck, title: "Traditional Taste", text: "Just like homemade." },
];

function ProductPage() {
  const { product } = Route.useLoaderData();
  const category = getCategory(product.category);
  const { addItem, setOpen } = useCart();
  const [variant, setVariant] = useState(
    product.variants[0] ?? { label: "250g", price: product.price },
  );
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const related = productsByCategory(product.category)
    .filter((p) => p.id !== product.id)
    .slice(0, 4);
  const frequentlyBought = related.slice(0, 2);
  const comboTotal = product.price + frequentlyBought.reduce((s, p) => s + p.price, 0);

  const waUrl = buildWhatsAppUrl(
    `Hi PickleMart, I'd like to order ${product.name} (${variant.label}) x ${qty}.`,
  );

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
            src={product.gallery[activeImage] ?? product.image}
            alt={product.name}
            width={900}
            height={900}
            className="w-full rounded-2xl border border-border object-cover shadow-warm"
          />
          {product.gallery.length > 1 && (
            <div className="mt-3 flex gap-2">
              {product.gallery.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={
                    i === activeImage
                      ? "size-16 overflow-hidden rounded-lg border-2 border-primary"
                      : "size-16 overflow-hidden rounded-lg border border-border opacity-70 hover:opacity-100"
                  }
                >
                  <img src={img} alt="" className="size-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2">
            <VegBadge isVeg={product.isVeg} />
            <span className="text-xs uppercase tracking-widest text-muted-foreground">
              {category?.name}
            </span>
          </div>
          <h1 className="mt-2 font-display text-3xl font-bold">{product.name}</h1>
          <div className="mt-2 flex items-center gap-3">
            <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
          </div>
          <p className="mt-3 text-muted-foreground">{product.description}</p>

          <div className="mt-5 flex items-baseline gap-3">
            <p className="font-display text-3xl font-bold text-primary">
              {formatINR(variant.price)}
            </p>
            {product.discount && (
              <>
                <p className="text-lg text-muted-foreground line-through">
                  {formatINR(
                    Math.round((product.originalPrice ?? 0) * (variant.price / product.price)),
                  )}
                </p>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                  {product.discount}% off
                </span>
              </>
            )}
          </div>

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

          <div className="mt-8">
            <p className="font-display text-base font-semibold">Why You'll Love It</p>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {benefits.map((b) => (
                <div
                  key={b.title}
                  className="rounded-xl border border-border bg-card p-3 text-center"
                >
                  <b.icon className="mx-auto size-5 text-primary" />
                  <p className="mt-2 text-xs font-semibold">{b.title}</p>
                </div>
              ))}
            </div>
          </div>

          <Accordion type="single" collapsible className="mt-8" defaultValue="ingredients">
            <AccordionItem value="description">
              <AccordionTrigger>Description</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {product.description}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="ingredients">
              <AccordionTrigger>Ingredients</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {product.ingredients}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="how-to-use">
              <AccordionTrigger>How to Use</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Serve a small spoonful alongside hot rice, curd rice or dosa. Mix with a little ghee
                or oil to bring out the flavour before serving.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="storage">
              <AccordionTrigger>Storage Instructions</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Use a dry spoon every time, keep the jar tightly closed and store in a cool, dry
                place away from direct sunlight.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="shelf-life">
              <AccordionTrigger>Shelf Life</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Best within 12 months of packing when stored as instructed above.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="shipping">
              <AccordionTrigger>Shipping Information</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Packed in leak-proof jars and shipped within 1–2 business days. Delivery typically
                takes 3–7 business days across India — shipping charges are confirmed on WhatsApp.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {frequentlyBought.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl font-bold">Frequently Bought Together</h2>
          <div className="mt-6 flex flex-col items-start gap-4 rounded-xl border border-border bg-card p-5 sm:flex-row sm:items-center">
            <div className="flex flex-1 flex-wrap items-center gap-3">
              {[product, ...frequentlyBought].map((p, i) => (
                <div key={p.id} className="flex items-center gap-3">
                  {i > 0 && <span className="text-lg text-muted-foreground">+</span>}
                  <div className="flex items-center gap-2">
                    <img src={p.image} alt={p.name} className="size-14 rounded-lg object-cover" />
                    <span className="max-w-[9rem] text-xs font-medium leading-tight">{p.name}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex w-full flex-col items-start gap-3 sm:w-auto sm:items-end">
              <p className="font-display text-xl font-bold text-primary">
                {formatINR(comboTotal)}{" "}
                <span className="text-xs font-normal text-muted-foreground">total</span>
              </p>
              <Button
                size="sm"
                onClick={() => {
                  [product, ...frequentlyBought].forEach((p) => {
                    addItem({
                      id: p.id,
                      name: p.name,
                      weight: p.variants[0]?.label ?? "250g",
                      price: p.price,
                      qty: 1,
                      image: p.image,
                    });
                  });
                  toast.success("Added all 3 items to your basket");
                  setOpen(true);
                }}
              >
                <ShoppingBag className="size-4" /> Add all to basket
              </Button>
            </div>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-16">
          <div className="leaf-divider mb-8 text-border" />
          <h2 className="font-display text-2xl font-bold">You May Also Like</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
