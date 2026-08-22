import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, Search, ShoppingBag, X, ChevronDown } from "lucide-react";
import { useState } from "react";
import { categories, searchProducts, formatINR } from "@/data/products";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

function SearchBox({ onDone }: { onDone?: () => void }) {
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const results = searchProducts(q).slice(0, 6);

  return (
    <div className="relative w-full">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search pickles, podis, sweets…"
        aria-label="Search products"
        className="h-10 w-full rounded-full border border-border bg-card pl-9 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
      />
      {q.trim().length > 0 && (
        <div className="absolute left-0 right-0 top-12 z-50 overflow-hidden rounded-xl border border-border bg-popover shadow-lift">
          {results.length === 0 ? (
            <p className="px-4 py-5 text-sm text-muted-foreground">
              No products match “{q}”. Try “avakaya” or “podi”.
            </p>
          ) : (
            results.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setQ("");
                  onDone?.();
                  navigate({ to: "/product/$productId", params: { productId: p.id } });
                }}
                className="flex w-full items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-secondary"
              >
                <img src={p.image} alt="" loading="lazy" className="size-10 rounded-md object-cover" />
                <span className="flex-1 text-sm font-medium">{p.name}</span>
                <span className="text-sm text-muted-foreground">{formatINR(p.price)}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export function Navbar() {
  const { count, setOpen } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/95 backdrop-blur">
      <div className="h-1 w-full bg-gold-gradient" />
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[85vw] max-w-sm overflow-y-auto p-0">
            <SheetHeader className="bg-hero-gradient p-5">
              <SheetTitle className="text-left font-display text-xl text-primary-foreground">
                Kala Flavours
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col p-4">
              <SearchBox onDone={() => setMobileOpen(false)} />
              <p className="mt-5 px-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Categories
              </p>
              <div className="mt-2 flex flex-col">
                {categories.map((c) => (
                  <Link
                    key={c.slug}
                    to="/category/$categorySlug"
                    params={{ categorySlug: c.slug }}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between rounded-md px-1 py-2.5 text-sm font-medium hover:text-primary"
                  >
                    {c.name}
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
                      {c.count}
                    </span>
                  </Link>
                ))}
              </div>
              <div className="mt-5 flex flex-col gap-1 border-t border-border pt-4">
                {[
                  { to: "/", label: "Home" },
                  { to: "/about", label: "About" },
                  { to: "/contact", label: "Contact" },
                  { to: "/cart", label: "Cart" },
                ].map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-md px-1 py-2 text-sm font-medium hover:text-primary"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </nav>
          </SheetContent>
        </Sheet>

        <Link to="/" className="flex shrink-0 items-center gap-2">
          <span className="grid size-9 place-items-center rounded-full bg-hero-gradient font-display text-base text-primary-foreground">
            క
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-lg font-bold text-primary">Kala Flavours</span>
            <span className="hidden text-[10px] uppercase tracking-[0.22em] text-muted-foreground sm:block">
              Andhra Homemade
            </span>
          </span>
        </Link>

        <nav className="ml-4 hidden items-center gap-1 lg:flex">
          <Link
            to="/"
            className="rounded-md px-3 py-2 text-sm font-medium hover:text-primary"
            activeProps={{ className: "text-primary" }}
            activeOptions={{ exact: true }}
          >
            Home
          </Link>
          <div
            className="relative"
            onMouseEnter={() => setMegaOpen(true)}
            onMouseLeave={() => setMegaOpen(false)}
          >
            <button className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium hover:text-primary">
              Shop <ChevronDown className={cn("size-4 transition-transform", megaOpen && "rotate-180")} />
            </button>
            {megaOpen && (
              <div className="absolute left-1/2 top-full w-[640px] -translate-x-1/2 pt-2">
                <div className="grid grid-cols-2 gap-1 rounded-xl border border-border bg-popover p-3 shadow-lift">
                  {categories.map((c) => (
                    <Link
                      key={c.slug}
                      to="/category/$categorySlug"
                      params={{ categorySlug: c.slug }}
                      onClick={() => setMegaOpen(false)}
                      className="group flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-secondary"
                    >
                      <img src={c.image} alt="" loading="lazy" className="size-10 rounded-md object-cover" />
                      <span className="flex-1">
                        <span className="block text-sm font-semibold group-hover:text-primary">{c.name}</span>
                        <span className="block text-xs text-muted-foreground">{c.count} products</span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          <Link to="/about" className="rounded-md px-3 py-2 text-sm font-medium hover:text-primary">
            About
          </Link>
          <Link to="/contact" className="rounded-md px-3 py-2 text-sm font-medium hover:text-primary">
            Contact
          </Link>
        </nav>

        <div className="ml-auto hidden w-72 md:block">
          <SearchBox />
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="relative ml-auto md:ml-2"
          aria-label="Open cart"
          onClick={() => setOpen(true)}
        >
          <ShoppingBag className="size-5" />
          {count > 0 && (
            <span className="absolute -right-0.5 -top-0.5 grid min-w-5 place-items-center rounded-full bg-gold-gradient px-1 text-[11px] font-bold text-gold-foreground">
              {count}
            </span>
          )}
        </Button>
      </div>
    </header>
  );
}

export { X };
