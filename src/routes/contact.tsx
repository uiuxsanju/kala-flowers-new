import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { toast } from "sonner";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — PickleMart" },
      {
        name: "description",
        content:
          "Reach PickleMart for bulk orders, gifting boxes or shipping questions — WhatsApp, phone or email.",
      },
      { property: "og:title", content: "Contact Us — PickleMart" },
      {
        property: "og:description",
        content: "WhatsApp, call or email us about orders and gifting boxes.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-4xl font-bold">Contact us</h1>
      <p className="mt-3 text-muted-foreground">
        Bulk orders, wedding hampers or a question about a spice level — we answer fastest on
        WhatsApp.
      </p>

      <div className="mt-10 grid gap-8 md:grid-cols-2">
        <form
          className="space-y-4 rounded-xl border border-border bg-card p-6"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
            toast.success("Thanks! We'll get back to you shortly.");
          }}
        >
          <div>
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <input
              id="name"
              required
              className="mt-1 h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-primary"
            />
          </div>
          <div>
            <label htmlFor="email" className="text-sm font-medium">
              Email or phone
            </label>
            <input
              id="email"
              required
              className="mt-1 h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-primary"
            />
          </div>
          <div>
            <label htmlFor="message" className="text-sm font-medium">
              Message
            </label>
            <textarea
              id="message"
              required
              rows={5}
              className="mt-1 w-full rounded-md border border-border bg-background p-3 text-sm outline-none focus:border-primary"
            />
          </div>
          <Button type="submit" className="w-full">
            {sent ? "Message sent" : "Send message"}
          </Button>
        </form>

        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-6">
            <ul className="space-y-4 text-sm">
              <li className="flex gap-3">
                <Phone className="size-4 shrink-0 text-primary" /> +91 98765 43210
              </li>
              <li className="flex gap-3">
                <Mail className="size-4 shrink-0 text-primary" /> orders@picklemart.in
              </li>
              <li className="flex gap-3">
                <MapPin className="size-4 shrink-0 text-primary" />
                Plot 24, Kavuri Hills, Hyderabad, Telangana 500033
              </li>
            </ul>
            <Button variant="gold" className="mt-6 w-full" asChild>
              <a
                href={buildWhatsAppUrl("Hi PickleMart, I have a question.")}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle className="size-4" /> Chat on WhatsApp
              </a>
            </Button>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <p className="font-display text-base font-semibold">Kitchen hours</p>
            <p className="mt-1 text-sm text-muted-foreground">Mon–Sat, 9:00 AM – 7:00 PM IST</p>
          </div>
        </div>
      </div>
    </div>
  );
}
