import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Leaf, Package, Sun, Truck } from "lucide-react";
import heroImg from "@/assets/hero-pickles.jpg";
import { bestsellers, categories, products } from "@/data/products";
import { ProductCard } from "@/components/site/ProductCard";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kala Flavours — Andhra Homemade Pickles, Podis & Snacks" },
      {
        name: "description",
        content:
          "Order authentic Andhra & Telangana pickles, karapodulu, vadiyalu and festive sweets. Small batches, no preservatives, delivered across India.",
      },
      { property: "og:title", content: "Kala Flavours — Andhra Homemade Pickles & Podis" },
      {
        property: "og:description",
        content: "Small-batch Andhra pickles, podis, vadiyalu and sweets, shipped fresh across India.",
      },
    ],
  }),
  component: Home,
});

const trust = [
  { icon: Leaf, title: "No preservatives", text: "Only salt, oil and spice do the preserving." },
  { icon: Sun, title: "Sun-cured", text: "Mangoes and chillies dried the traditional way." },
  { icon: Package, title: "Packed fresh", text: "Cooked and packed in the same week." },
  { icon: Truck, title: "All-India delivery", text: "Leak-proof jars, tracked shipping." },
];

function Home() {
  return (
    <div>
      <section className="relative overflow-hidden bg-hero-gradient text-primary-foreground">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24">
          <div>
            <span className="inline-flex rounded-full border border-primary-foreground/30 px-3 py-1 text-xs uppercase tracking-[0.2em]">
              Andhra • Homemade • Since 1998
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-tight sm:text-5xl">
              Pickles that taste like your grandmother's kitchen
            </h1>
            <p className="mt-4 max-w-lg text-primary-foreground/85">
              Avakaya, gongura, chicken pickle, karapodulu and vadiyalu — cooked in small batches
              with cold-pressed sesame oil and stone-ground spices.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button variant="gold" size="lg" asChild>
                <Link to="/category/$categorySlug" params={{ categorySlug: "veg-pickles" }}>
                  Shop pickles <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
                asChild
              >
                <Link to="/about">Our story</Link>
              </Button>
            </div>
          </div>
          <div className="relative">
            <img
              src={heroImg}
              alt="Assorted Andhra pickles in glass jars"
              width={1200}
              height={900}
              className="w-full rounded-2xl object-cover shadow-lift"
            />
          </div>
        </div>
        <div className="kolam-strip h-10 w-full text-primary-foreground" />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {trust.map((t) => (
            <div key={t.title} className="rounded-xl border border-border bg-card p-5 shadow-warm">
              <t.icon className="size-6 text-primary" />
              <p className="mt-3 font-display text-base font-semibold">{t.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{t.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-6 sm:px-6">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">Shop by category</h2>
        <p className="mt-1 text-sm text-muted-foreground">{products.length}+ recipes across 10 categories</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c.slug}
              to="/category/$categorySlug"
              params={{ categorySlug: c.slug }}
              className="card-lift group overflow-hidden rounded-xl border border-border bg-card shadow-warm"
            >
              <img
                src={c.image}
                alt={c.name}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="p-4">
                <p className="font-display text-base font-semibold group-hover:text-primary">{c.name}</p>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{c.blurb}</p>
                <p className="mt-2 text-xs font-semibold text-accent">{c.count} products</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="leaf-divider mb-8" />
        <h2 className="font-display text-2xl font-bold sm:text-3xl">Bestsellers</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {bestsellers.slice(0, 8).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
