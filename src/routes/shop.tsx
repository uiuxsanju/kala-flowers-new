import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SlidersHorizontal, Search, X } from "lucide-react";
import { categories, products, allWeights, searchProducts } from "@/data/products";
import { ProductCard } from "@/components/site/ProductCard";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop All Products — PickleMart" },
      {
        name: "description",
        content:
          "Browse the full PickleMart range — pickles, masalas, spice powders, vadiyalu, snacks and sweets. Filter by category, veg/non-veg, price and weight.",
      },
    ],
  }),
  component: ShopPage,
});

type SortKey = "popular" | "newest" | "price-asc" | "price-desc" | "rated";

const priceBands = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under ₹200", min: 0, max: 200 },
  { label: "₹200 – ₹400", min: 200, max: 400 },
  { label: "₹400 – ₹600", min: 400, max: 600 },
  { label: "Above ₹600", min: 600, max: Infinity },
];

function FilterPanel({
  selectedCategories,
  toggleCategory,
  vegOnly,
  setVegOnly,
  nonVegOnly,
  setNonVegOnly,
  priceBand,
  setPriceBand,
  selectedWeights,
  toggleWeight,
  inStockOnly,
  setInStockOnly,
  onClear,
}: {
  selectedCategories: string[];
  toggleCategory: (slug: string) => void;
  vegOnly: boolean;
  setVegOnly: (v: boolean) => void;
  nonVegOnly: boolean;
  setNonVegOnly: (v: boolean) => void;
  priceBand: number;
  setPriceBand: (i: number) => void;
  selectedWeights: string[];
  toggleWeight: (w: string) => void;
  inStockOnly: boolean;
  setInStockOnly: (v: boolean) => void;
  onClear: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="font-display text-base font-semibold">Filters</p>
        <button onClick={onClear} className="text-xs font-medium text-primary hover:underline">
          Clear all
        </button>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Category
        </p>
        <div className="mt-3 space-y-2.5">
          {categories.map((c) => (
            <label key={c.slug} className="flex cursor-pointer items-center gap-2.5 text-sm">
              <Checkbox
                checked={selectedCategories.includes(c.slug)}
                onCheckedChange={() => toggleCategory(c.slug)}
              />
              <span className="flex-1">{c.name}</span>
              <span className="text-xs text-muted-foreground">{c.count}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Diet
        </p>
        <div className="mt-3 space-y-2.5">
          <label className="flex cursor-pointer items-center gap-2.5 text-sm">
            <Checkbox checked={vegOnly} onCheckedChange={(v) => setVegOnly(v === true)} />
            <span className="inline-flex size-3.5 items-center justify-center rounded-[3px] border border-veg">
              <span className="size-1.5 rounded-full bg-veg" />
            </span>
            Vegetarian
          </label>
          <label className="flex cursor-pointer items-center gap-2.5 text-sm">
            <Checkbox checked={nonVegOnly} onCheckedChange={(v) => setNonVegOnly(v === true)} />
            <span className="inline-flex size-3.5 items-center justify-center rounded-[3px] border border-nonveg">
              <span className="size-1.5 rounded-full bg-nonveg" />
            </span>
            Non-Vegetarian
          </label>
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Price
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {priceBands.map((b, i) => (
            <button
              key={b.label}
              onClick={() => setPriceBand(i)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                priceBand === i
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-primary",
              )}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Weight
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {allWeights.map((w) => (
            <button
              key={w}
              onClick={() => toggleWeight(w)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                selectedWeights.includes(w)
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-primary",
              )}
            >
              {w}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Availability
        </p>
        <label className="mt-3 flex cursor-pointer items-center gap-2.5 text-sm">
          <Checkbox checked={inStockOnly} onCheckedChange={(v) => setInStockOnly(v === true)} />
          In stock only
        </label>
      </div>
    </div>
  );
}

function ShopPage() {
  const [q, setQ] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [vegOnly, setVegOnly] = useState(false);
  const [nonVegOnly, setNonVegOnly] = useState(false);
  const [priceBand, setPriceBand] = useState(0);
  const [selectedWeights, setSelectedWeights] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState<SortKey>("popular");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const toggleCategory = (slug: string) =>
    setSelectedCategories((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );
  const toggleWeight = (w: string) =>
    setSelectedWeights((prev) => (prev.includes(w) ? prev.filter((x) => x !== w) : [...prev, w]));
  const clearAll = () => {
    setSelectedCategories([]);
    setVegOnly(false);
    setNonVegOnly(false);
    setPriceBand(0);
    setSelectedWeights([]);
    setInStockOnly(false);
  };

  const items = useMemo(() => {
    const band = priceBands[priceBand] ?? priceBands[0]!;
    let list = q.trim() ? searchProducts(q) : products;
    if (selectedCategories.length)
      list = list.filter((p) => selectedCategories.includes(p.category));
    if (vegOnly && !nonVegOnly) list = list.filter((p) => p.isVeg);
    if (nonVegOnly && !vegOnly) list = list.filter((p) => !p.isVeg);
    list = list.filter((p) => p.price >= band.min && p.price <= band.max);
    if (selectedWeights.length)
      list = list.filter((p) => p.variants.some((v) => selectedWeights.includes(v.label)));
    if (inStockOnly) list = list.filter((p) => p.inStock);

    const sorted = [...list];
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    if (sort === "rated") sorted.sort((a, b) => b.rating - a.rating);
    if (sort === "newest") sorted.reverse();
    if (sort === "popular")
      sorted.sort((a, b) => Number(b.bestseller) - Number(a.bestseller) || b.rating - a.rating);
    return sorted;
  }, [q, selectedCategories, vegOnly, nonVegOnly, priceBand, selectedWeights, inStockOnly, sort]);

  const activeFilterCount =
    selectedCategories.length +
    (vegOnly ? 1 : 0) +
    (nonVegOnly ? 1 : 0) +
    (priceBand !== 0 ? 1 : 0) +
    selectedWeights.length +
    (inStockOnly ? 1 : 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold sm:text-4xl">Shop All Products</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {products.length}+ recipes across 10 categories
      </p>

      <div className="mt-6 relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search products…"
          aria-label="Search products"
          className="h-11 w-full rounded-full border border-border bg-card pl-9 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
        />
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">
          <FilterPanel
            selectedCategories={selectedCategories}
            toggleCategory={toggleCategory}
            vegOnly={vegOnly}
            setVegOnly={setVegOnly}
            nonVegOnly={nonVegOnly}
            setNonVegOnly={setNonVegOnly}
            priceBand={priceBand}
            setPriceBand={setPriceBand}
            selectedWeights={selectedWeights}
            toggleWeight={toggleWeight}
            inStockOnly={inStockOnly}
            setInStockOnly={setInStockOnly}
            onClear={clearAll}
          />
        </aside>

        <div>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="lg:hidden"
              onClick={() => setFiltersOpen(true)}
            >
              <SlidersHorizontal className="size-4" /> Filters{" "}
              {activeFilterCount > 0 && `(${activeFilterCount})`}
            </Button>
            <select
              aria-label="Sort products"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="h-9 rounded-md border border-border bg-card px-3 text-sm"
            >
              <option value="popular">Popular</option>
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rated">Best Rated</option>
            </select>
            <span className="ml-auto text-sm text-muted-foreground">{items.length} products</span>
          </div>

          {items.length === 0 ? (
            <div className="mt-16 text-center">
              <p className="font-display text-lg font-semibold">No flavours found.</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try another search or clear filters.
              </p>
              <Button variant="outline" size="sm" className="mt-4" onClick={clearAll}>
                Clear filters
              </Button>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
              {items.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>

      <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
        <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-2xl">
          <SheetHeader className="flex-row items-center justify-between space-y-0">
            <SheetTitle>Filters</SheetTitle>
            <button onClick={() => setFiltersOpen(false)} aria-label="Close filters">
              <X className="size-5" />
            </button>
          </SheetHeader>
          <div className="mt-4 pb-4">
            <FilterPanel
              selectedCategories={selectedCategories}
              toggleCategory={toggleCategory}
              vegOnly={vegOnly}
              setVegOnly={setVegOnly}
              nonVegOnly={nonVegOnly}
              setNonVegOnly={setNonVegOnly}
              priceBand={priceBand}
              setPriceBand={setPriceBand}
              selectedWeights={selectedWeights}
              toggleWeight={toggleWeight}
              inStockOnly={inStockOnly}
              setInStockOnly={setInStockOnly}
              onClear={clearAll}
            />
          </div>
          <Button className="w-full" onClick={() => setFiltersOpen(false)}>
            Show {items.length} results
          </Button>
        </SheetContent>
      </Sheet>
    </div>
  );
}
