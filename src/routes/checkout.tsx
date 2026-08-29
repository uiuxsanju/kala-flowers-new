import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { MessageCircle, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { formatINR } from "@/data/products";
import { useCart } from "@/lib/cart";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Kala Flavours" },
      { name: "robots", content: "noindex" },
      {
        name: "description",
        content: "Enter your delivery details and place your Kala Flavours order.",
      },
    ],
  }),
  component: CheckoutPage,
});

type FormState = {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
};

const EMPTY_FORM: FormState = {
  fullName: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
};

const DELIVERY_FEE = 0; // confirmed with the customer on WhatsApp before packing

function Field({
  id,
  label,
  required = true,
  ...rest
}: {
  id: keyof FormState;
  label: string;
  required?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
        {required && <span className="text-primary"> *</span>}
      </label>
      <input
        id={id}
        name={id}
        required={required}
        className="mt-1 h-10 w-full rounded-md border border-border bg-background px-3 text-base outline-none transition-colors focus:border-primary sm:text-sm"
        {...rest}
      />
    </div>
  );
}

function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const total = subtotal + DELIVERY_FEE;

  const update = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const placeOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    const lines = [
      "*Kala Flavours — New Order*",
      "",
      ...items.map(
        (i, idx) =>
          `${idx + 1}. ${i.name} (${i.weight}) x ${i.qty} — ${formatINR(i.price * i.qty)}`,
      ),
      "",
      `Subtotal: ${formatINR(subtotal)}`,
      `Delivery: ${DELIVERY_FEE === 0 ? "To be confirmed" : formatINR(DELIVERY_FEE)}`,
      `*Total: ${formatINR(total)}*`,
      "",
      "*Delivery Details*",
      `Name: ${form.fullName}`,
      `Phone: ${form.phone}`,
      form.email ? `Email: ${form.email}` : undefined,
      `Address: ${form.address}, ${form.city}, ${form.state} - ${form.pincode}`,
      "",
      "Please confirm my order.",
    ].filter(Boolean);

    window.open(buildWhatsAppUrl(lines.join("\n")), "_blank", "noreferrer");
    toast.success("Order details sent on WhatsApp — we'll confirm shortly.");
    clear();
    navigate({ to: "/" });
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <ShoppingBag className="mx-auto size-10 text-muted-foreground" />
        <h1 className="mt-4 font-display text-2xl font-bold">Your basket is empty</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Add a few flavours to your basket before checking out.
        </p>
        <Button className="mt-6" asChild>
          <Link to="/shop">Browse Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <nav className="text-xs text-muted-foreground">
        <Link to="/" className="hover:text-primary">
          Home
        </Link>{" "}
        /{" "}
        <Link to="/cart" className="hover:text-primary">
          Basket
        </Link>{" "}
        / <span className="text-foreground">Checkout</span>
      </nav>

      <h1 className="mt-4 font-display text-2xl font-bold sm:text-3xl">Checkout</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Enter your delivery details — we'll confirm packing dates and any delivery charge on
        WhatsApp before your order ships.
      </p>

      <form onSubmit={placeOrder} className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6">
            <p className="font-display text-base font-semibold">Customer Details</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field
                id="fullName"
                label="Full Name"
                value={form.fullName}
                onChange={update("fullName")}
              />
              <Field
                id="phone"
                label="Phone Number"
                type="tel"
                value={form.phone}
                onChange={update("phone")}
              />
              <div className="sm:col-span-2">
                <Field
                  id="email"
                  label="Email"
                  type="email"
                  required={false}
                  value={form.email}
                  onChange={update("email")}
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <p className="font-display text-base font-semibold">Delivery Address</p>
            <div className="mt-4 grid gap-4">
              <Field
                id="address"
                label="Address"
                value={form.address}
                onChange={update("address")}
              />
              <div className="grid gap-4 sm:grid-cols-3">
                <Field id="city" label="City" value={form.city} onChange={update("city")} />
                <Field id="state" label="State" value={form.state} onChange={update("state")} />
                <Field
                  id="pincode"
                  label="Pincode"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  value={form.pincode}
                  onChange={update("pincode")}
                />
              </div>
            </div>
          </div>
        </div>

        <aside className="h-fit space-y-4 rounded-xl border border-border bg-card p-6">
          <p className="font-display text-base font-semibold">Order Summary</p>
          <div className="space-y-3">
            {items.map((i) => (
              <div key={i.key} className="flex items-start justify-between gap-3 text-sm">
                <span className="flex-1">
                  {i.name}
                  <span className="block text-xs text-muted-foreground">
                    {i.weight} × {i.qty}
                  </span>
                </span>
                <span className="font-medium">{formatINR(i.price * i.qty)}</span>
              </div>
            ))}
          </div>
          <div className="space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">{formatINR(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Delivery</span>
              <span className="text-muted-foreground">To be confirmed</span>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-2">
              <span className="font-display text-base font-semibold">Total</span>
              <span className="font-sans text-xl font-semibold text-foreground">
                {formatINR(total)}
              </span>
            </div>
          </div>
          <Button type="submit" className="w-full" size="lg">
            <MessageCircle className="size-4" /> Place Order on WhatsApp
          </Button>
          <p className="text-xs text-muted-foreground">
            Placing your order opens WhatsApp with your details pre-filled — we'll confirm
            everything with you there.
          </p>
        </aside>
      </form>
    </div>
  );
}