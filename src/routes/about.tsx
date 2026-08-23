import { createFileRoute } from "@tanstack/react-router";
import heroImg from "@/assets/hero-pickles.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Our Story — Kala Flavours" },
      {
        name: "description",
        content:
          "How Kala Flavours grew from one kitchen in Hyderabad into small-batch Andhra pickles, podis and snacks shipped across India.",
      },
      { property: "og:title", content: "Our Story — Kala Flavours" },
      {
        property: "og:description",
        content: "Small-batch Andhra pickles made the way they were made at home.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-4xl font-bold">Our story</h1>
      <p className="mt-4 text-muted-foreground">
        Kala Flavours began in 1998 with one steel drum of mango avakaya on a Hyderabad terrace.
        Neighbours asked for a jar, then their relatives did, and the recipe never changed.
      </p>
      <img
        src={heroImg}
        alt="Jars of Andhra pickles on a table"
        className="mt-8 w-full rounded-2xl object-cover shadow-warm"
      />
      <div className="prose mt-8 max-w-none space-y-4 text-muted-foreground">
        <p>
          Every batch still starts the same way — raw mangoes from Nuzvid, guntur chillies ground on
          stone, and cold-pressed sesame oil. Nothing is machine-mixed and nothing carries a
          preservative.
        </p>
        <p>
          We cook to order through the season, so the jar you receive is usually less than a week
          old. Orders are confirmed on WhatsApp because most of our customers prefer talking to a
          person about what suits their household.
        </p>
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {[
          { k: "28 yrs", v: "of the same recipes" },
          { k: "150+", v: "products across 10 categories" },
          { k: "40k+", v: "jars shipped across India" },
        ].map((s) => (
          <div key={s.k} className="rounded-xl border border-border bg-card p-5 text-center">
            <p className="font-display text-2xl font-bold text-primary">{s.k}</p>
            <p className="mt-1 text-xs text-muted-foreground">{s.v}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
