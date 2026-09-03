import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/returns")({
  head: () => ({
    meta: [
      { title: "Returns & Refunds — Kala Flavours" },
      {
        name: "description",
        content: "Kala Flavours's policy on damaged deliveries, quality issues and refunds.",
      },
    ],
  }),
  component: ReturnsPage,
});

function ReturnsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold sm:text-4xl">Returns & Refunds</h1>
      <div className="prose mt-6 max-w-none space-y-4 text-sm text-muted-foreground">
        <p>
          Because our pickles, powders and snacks are freshly packed food items, we're unable to
          accept returns once an order has been delivered.
        </p>
        <p>
          <strong className="text-foreground">Damaged in transit:</strong> If a jar arrives broken
          or leaking, message us a photo on WhatsApp within 48 hours of delivery and we'll send a
          free replacement or refund.
        </p>
        <p>
          <strong className="text-foreground">Quality concerns:</strong> If something doesn't taste
          right, let us know within 3 days of delivery. We take quality seriously and will make it
          right.
        </p>
        <p>
          <strong className="text-foreground">Refunds:</strong> Approved refunds are processed to
          your original payment method within 5–7 business days.
        </p>
      </div>
    </div>
  );
}
