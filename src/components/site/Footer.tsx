import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Mail, MapPin, MessageCircle, Phone, Youtube } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const footerCategories = [
  { label: "Pickles", slug: "veg-pickles" },
  { label: "Masalas", slug: "masalas" },
  { label: "Powders", slug: "spice-powders" },
  { label: "Snacks", slug: "sweets-snacks" },
  { label: "Sweets", slug: "premium-sweets" },
];

export function Footer() {
  return (
    <footer className="mt-20 bg-hero-gradient text-primary-foreground">
      <div className="kolam-strip h-10 w-full text-primary-foreground" />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div>
          <h3 className="font-display text-2xl">PickleMart</h3>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-accent">
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

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-widest text-accent">
            Quick Links
          </h4>
          <ul className="mt-4 space-y-2 text-sm text-primary-foreground/80">
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
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-widest text-accent">
            Categories
          </h4>
          <ul className="mt-4 space-y-2 text-sm text-primary-foreground/80">
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
          <h4 className="mt-6 text-sm font-semibold uppercase tracking-widest text-accent">
            Customer Care
          </h4>
          <ul className="mt-4 space-y-2 text-sm text-primary-foreground/80">
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
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-widest text-accent">Contact</h4>
          <ul className="mt-4 space-y-3 text-sm text-primary-foreground/80">
            <li className="flex gap-2">
              <Phone className="size-4 shrink-0 text-accent" /> +91 98765 43210
            </li>
            <li className="flex gap-2">
              <Mail className="size-4 shrink-0 text-accent" /> orders@picklemart.in
            </li>
            <li className="flex gap-2">
              <MapPin className="size-4 shrink-0 text-accent" />
              Plot 24, Kavuri Hills, Hyderabad, Telangana 500033
            </li>
          </ul>
          <a
            href={buildWhatsAppUrl("Hi PickleMart, I have a question about an order.")}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-gold-gradient px-4 py-2 text-sm font-semibold text-gold-foreground"
          >
            <MessageCircle className="size-4" /> Order on WhatsApp
          </a>
        </div>
      </div>
      <div className="border-t border-primary-foreground/15 py-5 text-center text-xs text-primary-foreground/70">
        © {new Date().getFullYear()} PickleMart. All Rights Reserved.
      </div>
    </footer>
  );
}
