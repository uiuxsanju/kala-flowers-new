import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Mail, MapPin, MessageCircle, Phone, Youtube } from "lucide-react";
import { categories, WHATSAPP_NUMBER } from "@/data/products";

export function Footer() {
  return (
    <footer className="mt-20 bg-hero-gradient text-primary-foreground">
      <div className="kolam-strip h-10 w-full text-primary-foreground" />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div>
          <h3 className="font-display text-2xl">Kala Flavours</h3>
          <p className="mt-3 text-sm text-primary-foreground/80">
            Home-made Andhra pickles, karapodulu, vadiyalu and festive snacks — cooked in small batches,
            packed the same week, shipped across India.
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
          <h4 className="text-sm font-semibold uppercase tracking-widest text-accent">Shop</h4>
          <ul className="mt-4 space-y-2 text-sm text-primary-foreground/80">
            {categories.slice(0, 6).map((c) => (
              <li key={c.slug}>
                <Link
                  to="/category/$categorySlug"
                  params={{ categorySlug: c.slug }}
                  className="hover:text-accent"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-widest text-accent">Company</h4>
          <ul className="mt-4 space-y-2 text-sm text-primary-foreground/80">
            <li>
              <Link to="/about" className="hover:text-accent">
                Our Story
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-accent">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="/cart" className="hover:text-accent">
                Your Cart
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-widest text-accent">Reach us</h4>
          <ul className="mt-4 space-y-3 text-sm text-primary-foreground/80">
            <li className="flex gap-2">
              <Phone className="size-4 shrink-0 text-accent" /> +91 98765 43210
            </li>
            <li className="flex gap-2">
              <Mail className="size-4 shrink-0 text-accent" /> orders@kalaflavours.in
            </li>
            <li className="flex gap-2">
              <MapPin className="size-4 shrink-0 text-accent" />
              Plot 24, Kavuri Hills, Hyderabad, Telangana 500033
            </li>
          </ul>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-gold-gradient px-4 py-2 text-sm font-semibold text-gold-foreground"
          >
            <MessageCircle className="size-4" /> Order on WhatsApp
          </a>
        </div>
      </div>
      <div className="border-t border-primary-foreground/15 py-5 text-center text-xs text-primary-foreground/70">
        © {new Date().getFullYear()} Kala Flavours. Made with ghee, chilli and a lot of patience.
      </div>
    </footer>
  );
}
