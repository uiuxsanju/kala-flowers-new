import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Heart, MessageCircle, Quote, Star } from "lucide-react";
import founderImg from "@/assets/brand/founder-photo.jpg";
import vinayakaChavithiBanner from "@/assets/brand/vinayaka-chavithi-banner.jpg";
import { bestsellers, categories } from "@/data/products";
import { ProductCard } from "@/components/site/ProductCard";
import { ProductCarousel } from "@/components/site/ProductCarousel";
import { HeroCarousel } from "@/components/site/HeroCarousel";
import { Button } from "@/components/ui/button";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kala Flavours — Authentic Andhra Flavours" },
      {
        name: "description",
        content:
          "Shop authentic Andhra pickles, masalas, spice powders, traditional snacks and homemade flavours from Kala Flavours.",
      },
      { property: "og:title", content: "Kala Flavours — Authentic Andhra Flavours" },
      {
        property: "og:description",
        content:
          "Shop authentic Andhra pickles, masalas, spice powders, traditional snacks and homemade flavours from Kala Flavours.",
      },
    ],
  }),
  component: Home,
});

const testimonials = [
  {
    quote: "Absolutely loved the mango avakaya. It tastes just like homemade pickle.",
    name: "Priya",
    rating: 5,
  },
  {
    quote: "Chicken pickle was fresh, spicy and full of flavour.",
    name: "Ravi",
    rating: 5,
  },
  {
    quote: "Excellent packaging and authentic taste.",
    name: "Anjali",
    rating: 4,
  },
];

function Home() {
  const pickleBestsellers = bestsellers.filter(
    (p) => p.category === "veg-pickles" || p.category === "non-veg-pickles",
  );
  const favourites = pickleBestsellers.slice(0, 8);

  return (
    <div>
      <section className="relative overflow-hidden bg-hero-gradient text-primary-foreground">
        <div className="mandala-corner absolute -right-24 -top-24 size-96 rounded-full text-primary-foreground" />
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24">
          <div className="animate-fade-up">
            <span className="inline-flex rounded-full border border-primary-foreground/30 px-3 py-1 text-xs uppercase tracking-[0.2em]">
              Authentic Taste • Homemade Tradition
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-tight sm:text-5xl">
              Authentic Flavours of Andhra
            </h1>
            <p className="mt-2 font-display text-lg italic text-accent sm:text-xl">
              ఆంధ్ర రుచి మన ఇంట్లో
            </p>
            <p className="mt-4 max-w-lg text-primary-foreground/85">
              Traditional recipes, homemade goodness and unforgettable taste — pickles, masalas and
              snacks cooked in small batches with cold-pressed sesame oil and stone-ground spices.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button variant="gold" size="lg" asChild>
                <Link to="/shop">
                  Shop Now <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
                asChild
              >
                <Link to="/shop">Explore Categories</Link>
              </Button>
              <Button size="lg" className="bg-[#25D366] text-white hover:bg-[#25D366]/90" asChild>
                <a
                  href={buildWhatsAppUrl("Hello, I am interested in ordering your products.")}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircle className="size-4" /> Order on WhatsApp
                </a>
              </Button>
            </div>
          </div>
          <div className="relative animate-fade-up [animation-delay:120ms]">
            <HeroCarousel />
          </div>
        </div>
        <div className="kolam-strip h-10 w-full text-primary-foreground" />
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6">
        <Link
          to="/shop"
          className="card-lift block overflow-hidden rounded-2xl border border-border shadow-warm"
        >
          <img
            src={vinayakaChavithiBanner}
            alt="Happy Vinayaka Chavithi from Kala Flavours — may Lord Ganesha bring happiness, prosperity and good health to you and your family"
            className="w-full object-cover"
          />
        </Link>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold sm:text-3xl">Our Bestsellers</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Handpicked favourites, fresh off the shelf.
            </p>
          </div>
          <Link
            to="/shop"
            className="hidden shrink-0 text-sm font-semibold text-primary hover:underline sm:block"
          >
            View all →
          </Link>
        </div>
        <div className="mt-6">
          <ProductCarousel products={favourites} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-6 sm:px-6">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">Shop Our Categories</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          From traditional pickles to aromatic masalas, discover flavours made with tradition.
        </p>
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
                <p className="font-display text-base font-semibold group-hover:text-primary">
                  {c.name}
                </p>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{c.blurb}</p>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-xs font-semibold text-accent">{c.count} products</p>
                  <span className="text-xs font-semibold text-primary opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                    Explore →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="leaf-divider mb-8 text-border" />
        <h2 className="font-display text-2xl font-bold sm:text-3xl">Customer Favourites</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {favourites.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <h2 className="text-center font-display text-2xl font-bold sm:text-3xl">
          What Our Customers Say
        </h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="card-lift rounded-xl border border-border bg-card p-6 shadow-warm"
            >
              <Quote className="size-6 text-accent" />
              <p className="mt-3 text-sm text-muted-foreground">"{t.quote}"</p>
              <div className="mt-4 flex items-center justify-between">
                <p className="font-display text-sm font-semibold">— {t.name}</p>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={
                        i < t.rating ? "size-3.5 fill-accent text-accent" : "size-3.5 text-border"
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-6 sm:px-6">
        <div className="flex flex-col items-center gap-5 rounded-2xl border border-border bg-card p-8 text-center shadow-warm sm:flex-row sm:justify-between sm:text-left">
          <div>
            <h2 className="font-display text-xl font-bold sm:text-2xl">
              Need Help With Your Order?
            </h2>
            <p className="mt-1.5 max-w-md text-sm text-muted-foreground">
              Chat with us directly on WhatsApp for product information, availability and orders.
            </p>
          </div>
          <Button
            size="lg"
            className="shrink-0 bg-[#25D366] text-white hover:bg-[#25D366]/90"
            asChild
          >
            <a
              href={buildWhatsAppUrl("Hello, I am interested in ordering your products.")}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle className="size-4" /> WhatsApp Us
            </a>
          </Button>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <div className="overflow-hidden rounded-2xl bg-hero-gradient px-6 py-12 text-center text-primary-foreground sm:px-12">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">
            Get 10% Off Your First Order
          </h2>
          <p className="mt-2 text-primary-foreground/85">
            Use code <span className="font-bold text-accent">FIRST10</span> at checkout on WhatsApp.
          </p>
          <Button variant="gold" size="lg" className="mt-6" asChild>
            <Link to="/shop">Shop Now</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}