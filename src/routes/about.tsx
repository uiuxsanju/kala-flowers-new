import { createFileRoute } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import founderImg from "@/assets/brand/founder-photo.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Founder Story — Kala Flavours" },
      {
        name: "description",
        content:
          "How Kala Flavours began in Visakhapatnam in 2015 — homemade Andhra pickles, masalas and snacks made the way they're made at home.",
      },
      { property: "og:title", content: "Founder Story — Kala Flavours" },
      {
        property: "og:description",
        content: "2015లో విశాఖపట్నంలో మొదలైన Kala Flavours రుచుల ప్రయాణం.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
        Founder Story
      </span>
      <h1 className="mt-2 font-display text-2xl font-bold leading-tight sm:text-3xl">
        2015లో విశాఖపట్నంలో మొదలైన Kala Flavours రుచుల ప్రయాణం.
      </h1>

      <img
        src={founderImg}
        alt="Founder of Kala Flavours, homemade with love in Visakhapatnam"
        className="mx-auto mt-8 h-[380px] w-full max-w-sm rounded-2xl object-cover shadow-warm sm:h-[420px]"
      />

      <div className="prose mt-8 max-w-none space-y-4 text-base leading-relaxed text-muted-foreground">
        <p>
          ఇంటి వంటలో ఉండే ఆప్యాయతను, అమ్మ చేతి పచ్చళ్లలో ఉండే అసలైన రుచిని ప్రతి ఇంటికీ అందించాలనే
          ఆలోచనతో Kala Flavours ప్రయాణం మొదలైంది.
        </p>
        <p>
          నాణ్యమైన పదార్థాలతో, సంప్రదాయ పద్ధతుల్లో, ఇంట్లో చేసినట్టే పచ్చళ్లు మరియు ఆంధ్ర వంటకాల
          రుచులను ఎంతో ప్రేమతో తయారు చేస్తున్నాము.
        </p>
        <p>మా కోసం ప్రతి పచ్చడి ఒక వంటకం మాత్రమే కాదు — ఇంటి జ్ఞాపకం, మన సంప్రదాయం, మన రుచి.</p>
      </div>

      <div className="mt-10 rounded-2xl border border-border bg-card p-6 text-center shadow-warm sm:p-8">
        <p className="font-display text-lg text-foreground sm:text-xl">
          విశాఖపట్నం నుంచి మీ ఇంటి వరకు…
        </p>
        <p className="mt-2 font-display text-xl font-bold text-primary sm:text-2xl">
          ఇదే మా Kala Flavours.{" "}
          <Heart className="inline size-5 fill-primary text-primary" aria-hidden="true" />
        </p>
      </div>
    </div>
  );
}