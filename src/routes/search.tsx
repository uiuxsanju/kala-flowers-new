import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import { z } from "zod";
import { searchProducts } from "@/data/products";
import { ProductRow } from "@/components/site/ProductRow";

const searchSchema = z.object({
  q: z.string().optional().default(""),
});

export const Route = createFileRoute("/search")({
  validateSearch: searchSchema,
  head: ({ match }) => ({
    meta: [
      {
        title: match.search?.q
          ? `“${match.search.q}” — Search — Kala Flavours`
          : "Search — Kala Flavours",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q: initialQ } = Route.useSearch();
  const [q, setQ] = useState(initialQ);
  const results = searchProducts(q);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold sm:text-4xl">Search</h1>

      <div className="relative mt-6 max-w-md">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search pickles, masalas, sweets…"
          autoFocus
          className="h-11 w-full rounded-full border border-border bg-card pl-9 pr-4 text-base outline-none transition-colors placeholder:text-muted-foreground focus:border-primary sm:text-sm"
        />
      </div>

      {q.trim() ? (
        <p className="mt-4 text-sm text-muted-foreground">
          {results.length} result{results.length === 1 ? "" : "s"} for{" "}
          <strong className="text-foreground">“{q}”</strong>
        </p>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">
          Start typing to search the full Kala Flavours catalogue.
        </p>
      )}

      {q.trim() && results.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="font-display text-lg font-semibold">No flavours found.</p>
          <p className="mt-1 text-sm text-muted-foreground">Try another search.</p>
          <Link
            to="/shop"
            className="mt-4 inline-block text-sm font-semibold text-primary hover:underline"
          >
            Browse all products
          </Link>
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-3">
          {results.map((p) => (
            <ProductRow key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
