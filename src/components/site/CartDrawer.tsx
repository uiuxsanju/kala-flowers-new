import { Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { formatINR } from "@/data/products";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export function CartDrawer() {
  const { open, setOpen, items, subtotal, setQty, removeItem } = useCart();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="bg-hero-gradient p-5">
          <SheetTitle className="text-left font-display text-xl text-primary-foreground">
            Your Basket
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
            <span className="grid size-16 place-items-center rounded-full bg-secondary">
              <ShoppingBag className="size-7 text-primary" />
            </span>
            <p className="font-display text-lg font-semibold">Your basket is empty</p>
            <p className="text-sm text-muted-foreground">
              Start with a jar of Mango Avakaya — it goes with everything.
            </p>
            <Button className="mt-2" onClick={() => setOpen(false)} asChild>
              <Link to="/shop">Browse Products</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {items.map((i) => (
                <div key={i.key} className="flex gap-3 rounded-lg border border-border bg-card p-3">
                  <div className="flex-1">
                    <p className="text-sm font-semibold leading-tight">{i.name}</p>
                    <p className="text-xs text-muted-foreground">{i.weight}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex items-center rounded-full border border-border">
                        <button
                          aria-label="Decrease quantity"
                          className="grid size-9 place-items-center text-muted-foreground hover:text-primary"
                          onClick={() => setQty(i.key, i.qty - 1)}
                        >
                          <Minus className="size-3.5" />
                        </button>
                        <span className="w-6 text-center text-sm font-semibold">{i.qty}</span>
                        <button
                          aria-label="Increase quantity"
                          className="grid size-9 place-items-center text-muted-foreground hover:text-primary"
                          onClick={() => setQty(i.key, i.qty + 1)}
                        >
                          <Plus className="size-3.5" />
                        </button>
                      </div>
                      <span className="ml-auto font-semibold text-primary">
                        {formatINR(i.price * i.qty)}
                      </span>
                      <button
                        aria-label="Remove item"
                        onClick={() => removeItem(i.key)}
                        className="-m-2 p-2 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 border-t border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="font-sans text-xl font-semibold text-foreground">
                  {formatINR(subtotal)}
                </span>
              </div>
              <Button className="w-full" onClick={() => setOpen(false)} asChild>
                <Link to="/checkout">Proceed to Checkout</Link>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}