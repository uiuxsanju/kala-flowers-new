import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  ChevronDown,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Youtube,
} from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import logo from "@/assets/brand/kala-flavours-logo.jpg";

const footerCategories = [
  { label: "Pickles", slug: "veg-pickles" },
  { label: "Masalas", slug: "masalas" },
  { label: "Powders", slug: "spice-powders" },
  { label: "Snacks", slug: "sweets-snacks" },
  { label: "Sweets", slug: "premium-sweets" },
];

// A section that collapses to a tap-to-expand accordion on mobile (keeping
// the footer short and scannable on a phone) and unfolds into a plain,
// always-open column on desktop — content is identical either way, so
// nothing is ever hidden from search engines, just visually collapsed.
function FooterSection({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-primary-foreground/15 py-3.5 sm:border-none sm:py-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between text-sm font-semibold uppercase tracking-widest text-accent sm:pointer-events-none sm:cursor-default"
      >
        {title}
        <ChevronDown
          className={cn("size-4 transition-transform sm:hidden", open && "rotate-180")}
        />
      </button>
      <div
        className={cn(
          "grid overflow-hidden transition-[grid-template-rows] duration-300",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
          "sm:!grid-rows-[1fr]",
        )}
      >
        <div className="overflow-hidden">
          <div className="pt-3 sm:pt-4">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="mt-20 bg-hero-gradient text-primary-foreground">
      <div className="kolam-strip h-6 w-full text-primary-foreground sm:h-10" />
      <div className="mx-auto grid max-w-7xl gap-2 px-4 py-8 sm:gap-10 sm:px-6 sm:py-12 md:grid-cols-4">
        <div className="pb-4 sm:pb-0">
          <Link to="/" className="flex items-center gap-3">
            <img
              src={logo}
              alt="Kala Flavours — Homemade Foods"
              className="size-12 shrink-0 rounded-full border border-primary-foreground/30 object-cover sm:size-14"
            />
            <h3 className="font-display text-xl sm:text-2xl">Kala Flavours</h3>
          </Link>
          <p className="mt-3 text-xs uppercase tracking-[0.2em] text-accent">
            Authentic Taste. Homemade Tradition.
          </p>
          <p className="mt-3 text-sm text-primary-foreground/80">
            Homemade Andhra pickles, masalas, spice powders and traditional snacks — cooked in small
            batches, packed with care and shipped across India.
          </p>
          <div className="mt-5 flex gap-3">
            {[Instagram, Facebook, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="Social link"
                className="grid size-9 place-items-center rounded-full border border-primary-foreground/30 transition-colors hover:bg-primary-foreground/10"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        <FooterSection title="Quick Links">
          <ul className="space-y-2 text-sm text-primary-foreground/80">
            <li>
              <Link to="/" className="hover:text-accent">
                Home
              </Link>
            </li>
            <li>
              <Link to="/shop" className="hover:text-accent">
                Shop
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-accent">
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-accent">
                Contact
              </Link>
            </li>
          </ul>
        </FooterSection>

        <div>
          <FooterSection title="Categories">
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              {footerCategories.map((c) => (
                <li key={c.slug}>
                  <Link
                    to="/category/$categorySlug"
                    params={{ categorySlug: c.slug }}
                    className="hover:text-accent"
                  >
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterSection>
          <FooterSection title="Customer Care">
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li>
                <Link to="/shipping" className="hover:text-accent">
                  Shipping
                </Link>
              </li>
              <li>
                <Link to="/returns" className="hover:text-accent">
                  Returns
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-accent">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-accent">
                  Terms
                </Link>
              </li>
            </ul>
          </FooterSection>
        </div>

        <FooterSection title="Contact">
          <ul className="space-y-3 text-sm text-primary-foreground/80">
            <li className="flex gap-2">
              <Phone className="size-4 shrink-0 text-accent" /> +91 96187 24889
            </li>
            <li className="flex gap-2">
              <Mail className="size-4 shrink-0 text-accent" /> orders@kalaflavours.in
            </li>
            <li className="flex gap-2">
              <MapPin className="size-4 shrink-0 text-accent" />
              Opposite Sankaramatam Temple, Shankramatam Road, Visakhapatnam - 530016, Andhra
              Pradesh
            </li>
          </ul>
          <a
            href={buildWhatsAppUrl("Hi Kala Flavours, I have a question about an order.")}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-gold-gradient px-4 py-2 text-sm font-semibold text-gold-foreground"
          >
            <MessageCircle className="size-4" /> Order on WhatsApp
          </a>
        </FooterSection>
      </div>
      <div className="border-t border-primary-foreground/15 py-4 text-center text-xs text-primary-foreground/70 sm:py-5">
        © {new Date().getFullYear()} Designed by Sanju.
      </div>
    </footer>
  );
}