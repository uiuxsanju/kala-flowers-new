import { MessageCircle } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export function FloatingWhatsApp() {
  return (
    <a
      href={buildWhatsAppUrl("Hello, I am interested in ordering your products.")}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with Kala Flavours on WhatsApp"
      className="fixed right-5 z-40 grid size-14 shrink-0 place-items-center"
      style={{ bottom: "calc(1.25rem + env(safe-area-inset-bottom))" }}
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-60 motion-safe:animate-ping" />
      <span className="absolute inset-0 rounded-full bg-[#25D366] shadow-lift ring-2 ring-white/80" />
      <span className="relative grid size-14 place-items-center rounded-full transition-transform hover:scale-105 active:scale-95">
        <MessageCircle className="size-7 fill-white text-[#25D366]" />
      </span>
    </a>
  );
}
