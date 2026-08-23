import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2, MessageCircle } from "lucide-react";
import { formatINR } from "@/data/products";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Basket — Kala Flavours" },
      {
        name: "description",
        content: "Review your Kala Flavours basket and place the order on WhatsApp.",
      },
      { property: "og:title", content: "Your Basket — Kala Flavours" },
      { property: "og:description", content: "Review your basket and order Andhra pickles on WhatsApp." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, subtotal, setQty, removeItem, clear, whatsappUrl } = useCart();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold">Your basket</h1>

      {items.length === 0 ? (
        <div className="mt-10 rounded-xl border border-border bg-card p-10 text-center">
          <p className="font-display text-lg font-semibold">Nothing here yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Add a jar of Mango Avakaya and a podi to get started.
          </p>
          <Button className="mt-5" asChild>
            <Link to="/category/$categorySlug" params={{ categorySlug: "veg-pickles" }}>
              Browse pickles
            </Link>
          </Button>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-3">
            {items.map((i) => (
              <div key={i.key} className="flex gap-4 rounded-xl border border-border bg-card p-4">
                <img src={i.image} alt="" loading="lazy" className="size-20 rounded-lg object-cover" />
                <div className="flex-1">
                  <p className="font-display text-base font-semibold">{i.name}</p>
                  <p className="text-xs text-muted-foreground">{i.weight}</p>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex items-center rounded-full border border-border">
                      <button
                        aria-label="Decrease quantity"
                        className="grid size-8 place-items-center text-muted-foreground hover:text-primary"
                        onClick={() => setQty(i.key, i.qty - 1)}
                      >
                        <Minus className="size-3.5" />
                      </button>
                      <span className="w-7 text-center text-sm font-semibold">{i.qty}</span>
                      <button
                        aria-label="Increase quantity"
                        className="grid size-8 place-items-center text-muted-foreground hover:text-primary"
                        onClick={() => setQty(i.key, i.qty + 1)}
                      >
                        <Plus className="size-3.5" />
                      </button>
                    </div>
                    <span className="font-semibold text-primary">{formatINR(i.price * i.qty)}</span>
                    <button
                      aria-label="Remove item"
                      onClick={() => removeItem(i.key)}
                      className="ml-auto text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <button onClick={clear} className="text-sm text-muted-foreground hover:text-destructive">
              Clear basket
            </button>
          </div>

          <aside className="h-fit rounded-xl border border-border bg-card p-5">
            <p className="font-display text-lg font-semibold">Order summary</p>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold">{formatINR(subtotal)}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span className="text-muted-foreground">Confirmed on WhatsApp</span>
            </div>
            <Button variant="gold" className="mt-5 w-full" asChild>
              <a href={whatsappUrl} target="_blank" rel="noreferrer">
                <MessageCircle className="size-4" /> Checkout via WhatsApp
              </a>
            </Button>
            <p className="mt-3 text-xs text-muted-foreground">
              We confirm packing dates and shipping charges over chat before payment.
            </p>
          </aside>
        </div>
      )}
    </div>
  );
}
