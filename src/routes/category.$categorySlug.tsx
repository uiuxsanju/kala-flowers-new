import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { getCategory, productsByCategory } from "@/data/products";
import { ProductRow } from "@/components/site/ProductRow";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/category/$categorySlug")({
  loader: ({ params }) => {
    const category = getCategory(params.categorySlug);
    if (!category) throw notFound();
    return { category };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Category not found — Kala Flavours" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { category } = loaderData;
    const title = `${category.name} — Kala Flavours`;
    return {
      meta: [
        { title },
        { name: "description", content: category.blurb },
        { property: "og:title", content: title },
        { property: "og:description", content: category.blurb },
      ],
    };
  },
  component: CategoryPage,
});

type SortKey = "featured" | "price-asc" | "price-desc" | "name";

function CategoryPage() {
  const { category } = Route.useLoaderData();
  const [sort, setSort] = useState<SortKey>("featured");
  const [vegOnly, setVegOnly] = useState(false);
  const [q, setQ] = useState("");

  const items = useMemo(() => {
    let list = productsByCategory(category.slug);
    if (vegOnly) list = list.filter((p) => p.isVeg);
    if (q.trim()) {
      const term = q.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(term) || p.shortDescription.toLowerCase().includes(term),
      );
    }
    const sorted = [...list];
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    if (sort === "name") sorted.sort((a, b) => a.name.localeCompare(b.name));
    return sorted;
  }, [category.slug, sort, vegOnly, q]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <nav className="text-xs text-muted-foreground">
        <Link to="/" className="hover:text-primary">
          Home
        </Link>{" "}
        / <span className="text-foreground">{category.name}</span>
      </nav>

      <header className="mt-4 overflow-hidden rounded-2xl bg-hero-gradient p-8 text-primary-foreground">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">{category.name}</h1>
        <p className="mt-1 text-sm text-primary-foreground/70">{category.count} Products</p>
        <p className="mt-2 max-w-2xl text-primary-foreground/85">{category.blurb}</p>
      </header>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products…"
            aria-label={`Search ${category.name}`}
            className="h-10 w-full rounded-full border border-border bg-card pl-9 pr-4 text-base outline-none transition-colors placeholder:text-muted-foreground focus:border-primary sm:text-sm"
          />
        </div>
        <Button
          variant={vegOnly ? "default" : "outline"}
          size="sm"
          onClick={() => setVegOnly((v) => !v)}
        >
          Veg only
        </Button>
        <select
          aria-label="Sort products"
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="h-10 rounded-md border border-border bg-card px-3 text-base sm:h-9 sm:text-sm"
        >
          <option value="featured">Sort: Recommended</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name">Name: A–Z</option>
        </select>
        <span className="text-sm text-muted-foreground sm:ml-auto">
          {items.length} product{items.length === 1 ? "" : "s"}
        </span>
      </div>

      {items.length === 0 ? (
        <p className="mt-12 text-center text-sm text-muted-foreground">
          No flavours found. Try a different search or clear filters.
        </p>
      ) : (
        <div className="mt-6 flex flex-col gap-3">
          {items.map((p) => (
            <ProductRow key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
