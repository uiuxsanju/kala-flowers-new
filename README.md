# Kala Flavors

Build "kala Flovours" — a premium South Indian pickle, spice powder, vadiyalu, and traditional snacks e-commerce storefront, inspired by authentic Andhra/Telangana home-made food brands.

BRAND & THEME:

- Primary color: deep red / maroon (#8B0000 to #B22222 range) as the dominant brand color

- Secondary/accent: warm gold/mustard (#D4A017 or similar) for highlights, badges, buttons hover states

- Background: warm off-white/cream (#FFF8F0) — not stark white, to feel warm and appetizing

- Typography: a bold serif or slab-serif for headings (traditional, trustworthy feel), clean sans-serif for body text

- Overall mood: authentic, homemade, traditional Andhra food brand — appetizing, warm, trustworthy — NOT a generic minimalist tech store

- Use subtle traditional Indian textural motifs (kolam patterns, mango-leaf border accents, or terracotta textures) sparingly in headers/dividers — tasteful, not overdone

PAGES / ROUTES:

1. Home page:

   - Hero section with brand tagline, red gradient/banner background, CTA button "Explore Products"

   - Category showcase grid — 10 category cards with icon/image, name, and product count badge

   - Featured/bestseller products carousel (use 8-10 sample products)

   - "Why PickleMart" trust section (authentic recipes, no preservatives, homemade, fast delivery)

   - Customer testimonials section (placeholder)

   - Footer with contact, WhatsApp order link, social icons

2. Category listing page (dynamic by category):

   - Left sidebar (desktop) / top filter bar (mobile): filter by category, veg/non-veg toggle, price range, sort (popularity, price low-high, high-low)

   - Product grid (responsive: 4 cols desktop, 2 cols tablet, 1-2 cols mobile)

   - Each product card: image, name, price, weight/size options (e.g., 250g/500g/1kg), "Add to Cart" button, veg/non-veg indicator dot (green/red)

3. Product detail page:

   - Image gallery (2-3 images), name, description, ingredients, price by weight variant selector, quantity selector, "Add to Cart" + "Order on WhatsApp" buttons

   - Related products section

4. Cart page / slide-in cart drawer:

   - List items with quantity edit, remove, subtotal

   - "Checkout via WhatsApp" primary button (generates a pre-filled WhatsApp message with order summary — no payment gateway needed)

5. About page: brand story placeholder, sourcing/quality story

6. Contact page: WhatsApp click-to-chat button, phone, email, address, simple contact form

NAVIGATION:

- Sticky top navbar: Logo (left), category mega-menu/dropdown (center) showing all 10 categories, search bar, cart icon with item count badge (right)

- Mobile: hamburger menu with collapsible category list

CATEGORIES (use these exact 10 categories with these product counts — populate each with 3-4 REALISTIC SAMPLE products for now, not the full list, to keep this build lightweight):

1. Non-Veg Pickles (31 products) — e.g. Chicken Pickle, Mutton Pickle, Prawns Pickle, Fish Pickle

2. Veg Pickles (35 products) — e.g. Mango Avakaya, Garlic Pickle, Lemon Pickle, Mixed Vegetable Pickle

3. Karapodulu / Spice Powders (21 products) — e.g. Idli Karapodi, Gongura Karapodi, Peanut Karapodi

4. Vadiyalu (13 products) — e.g. Rice Vadiyalu, Carrot Vadiyalu, Ragi Vadiyalu

5. Powders / Cooking Products (4 products) — e.g. Rasam Powder, Sambar Powder

6. Sweets & Snacks (35 products) — e.g. Ribbon Murukku, Ariselu, Laddu, Chekkalu

7. Masalas (6 products) — e.g. Chicken Masala, Mutton Masala, Turmeric Powder

8. Spice Powders (3 products) — e.g. Coriander Powder, Cumin Powder

9. Cooking Pastes (5 products) — e.g. Pulihora Paste, Gongura Paste

10. Sweets & Premium Products (4 products) — e.g. Putharekulu, Dry Fruits, Ulavacharu

Data model: each product should have fields — id, name, category, veg/non-veg flag, description, price, weight variants (250g/500g/1kg with different prices), image, inStock. Structure this cleanly (e.g. a products array/JSON) so it's easy to swap in the full 157-product catalog later.

TECH & FUNCTIONALITY:

- Fully mobile-responsive (most traffic will be mobile)

- Cart with localStorage persistence

- WhatsApp ordering integration: cart checkout builds a formatted WhatsApp message (product names, quantities, weights, total) and opens wa.me link — NO payment gateway integration needed

- Search bar that filters products by name across all categories

- Smooth category filter/tab switching without full page reloads

- Loading states and empty states designed (not just functional placeholders)

SCOPE FOR THIS BUILD (important — keep this build focused):

- Build ONLY the customer-facing storefront described above with sample/placeholder product data

- Do NOT build an admin/dashboard panel in this pass — that will be added in a later phase

- Do NOT integrate real payment processing — WhatsApp order flow only

- Focus effort on: strong visual design, red-theme brand identity, smooth product browsing UX, and clean reusable component structure (so more products/categories can be added later without redesign)

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://kala-flavours-store.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/0585370b-09fb-4209-b9c8-3acedfd1dec8).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
