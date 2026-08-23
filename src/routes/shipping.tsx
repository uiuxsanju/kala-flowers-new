import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/shipping")({
  head: () => ({
    meta: [
      { title: "Shipping Information — PickleMart" },
      {
        name: "description",
        content:
          "Delivery timelines, packaging and shipping charges for PickleMart orders across India.",
      },
    ],
  }),
  component: ShippingPage,
});

function ShippingPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold sm:text-4xl">Shipping Information</h1>
      <div className="prose mt-6 max-w-none space-y-4 text-sm text-muted-foreground">
        <p>
          Every PickleMart order is packed to order in leak-proof jars and pouches, then shipped
          within 1–2 business days of confirmation.
        </p>
        <p>
          <strong className="text-foreground">Delivery time:</strong> 3–7 business days depending on
          your location. Metro cities typically receive orders faster than remote areas.
        </p>
        <p>
          <strong className="text-foreground">Shipping charges:</strong> Calculated based on weight
          and destination, and confirmed with you on WhatsApp before your order is packed.
        </p>
        <p>
          <strong className="text-foreground">Tracking:</strong> Once dispatched, you'll receive a
          tracking link on WhatsApp so you can follow your order to your doorstep.
        </p>
        <p>
          <strong className="text-foreground">Pan-India delivery:</strong> We currently ship across
          India. For bulk or international orders, please reach out on WhatsApp to discuss options.
        </p>
      </div>
    </div>
  );
}
