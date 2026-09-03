import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — Kala Flavours" },
      { name: "description", content: "Terms and conditions for shopping with Kala Flavours." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold sm:text-4xl">Terms & Conditions</h1>
      <div className="prose mt-6 max-w-none space-y-4 text-sm text-muted-foreground">
        <p>
          By ordering from Kala Flavours, you agree to the following terms. We may update this page
          from time to time.
        </p>
        <p>
          <strong className="text-foreground">Orders:</strong> Orders placed through the website
          cart are confirmed with you on WhatsApp, where final pricing, shipping charges and
          delivery dates are shared before payment.
        </p>
        <p>
          <strong className="text-foreground">Payments:</strong> We currently accept payment via
          UPI/bank transfer, confirmed directly over WhatsApp — the website itself does not process
          payments.
        </p>
        <p>
          <strong className="text-foreground">Product information:</strong> Product images are
          representative. Actual colour and texture may vary slightly batch to batch, as everything
          is handmade.
        </p>
        <p>
          <strong className="text-foreground">Allergens:</strong> Our kitchen handles nuts, sesame
          and dairy. Please check ingredient lists or ask us on WhatsApp if you have allergies.
        </p>
      </div>
    </div>
  );
}
