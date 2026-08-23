import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — PickleMart" },
      {
        name: "description",
        content: "How PickleMart collects, uses and protects your information.",
      },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold sm:text-4xl">Privacy Policy</h1>
      <div className="prose mt-6 max-w-none space-y-4 text-sm text-muted-foreground">
        <p>
          We collect only the information needed to process your order — your name, delivery
          address, phone number and order details shared when you check out via WhatsApp or our
          contact form.
        </p>
        <p>
          <strong className="text-foreground">How we use it:</strong> To confirm, pack and ship your
          order, and to answer questions you send us. We don't sell or share your information with
          third parties for marketing purposes.
        </p>
        <p>
          <strong className="text-foreground">Cart data:</strong> Items you add to your basket are
          stored locally in your browser so your cart is there when you come back — this data isn't
          sent anywhere until you choose to check out on WhatsApp.
        </p>
        <p>
          <strong className="text-foreground">Questions:</strong> If you'd like your information
          removed from our records, message us on WhatsApp and we'll take care of it.
        </p>
      </div>
    </div>
  );
}
