// Centralized WhatsApp configuration.
// Change the number in ONE place and every WhatsApp button/link across the
// app (product page, cart, contact page, floating button) picks it up.

export const WHATSAPP_NUMBER = "919618724889";

export const buildWhatsAppUrl = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

export const BRAND_NAME = "Kala Flavours";
