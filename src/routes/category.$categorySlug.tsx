import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { getCategory, productsByCategory } from "@/data/products";
import { ProductCard } from "@/components/site/ProductCard";
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
          { title: "Category not found — PickleMart" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { category } = loaderData;
    const title = `${category.name} — PickleMart`;
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

  const items = useMemo(() => {
    let list = productsByCategory(category.slug);
    if (vegOnly) list = list.filter((p) => p.isVeg);
    const sorted = [...list];
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    if (sort === "name") sorted.sort((a, b) => a.name.localeCompare(b.name));
    return sorted;
  }, [category.slug, sort, vegOnly]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <nav className="text-xs text-muted-foreground">
        <Link to="/" className="hover:text-primary">
          Home
        </Link>{" "}
        / <span className="text-foreground">{category.name}</span>
      </nav>

      <header className="mt-4 overflow-hidden rounded-2xl bg-hero-gradient p-8 text-primary-foreground">
        <h1 className="font-display text-3xl font-bold">{category.name}</h1>
        <p className="mt-2 max-w-2xl text-primary-foreground/85">{category.blurb}</p>
      </header>

      <div className="mt-6 flex flex-wrap items-center gap-3">
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
          className="h-9 rounded-md border border-border bg-card px-3 text-sm"
        >
          <option value="featured">Featured</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
          <option value="name">Name A–Z</option>
        </select>
        <span className="ml-auto text-sm text-muted-foreground">{items.length} products</span>
      </div>

      {items.length === 0 ? (
        <p className="mt-12 text-center text-sm text-muted-foreground">
          No products here yet. More recipes are being packed.
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
