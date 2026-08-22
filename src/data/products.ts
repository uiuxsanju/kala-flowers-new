import vegImg from "@/assets/cat-veg-pickle.jpg";
import nonVegImg from "@/assets/cat-nonveg-pickle.jpg";
import podiImg from "@/assets/cat-podi.jpg";
import vadiyaluImg from "@/assets/cat-vadiyalu.jpg";
import sweetsImg from "@/assets/cat-sweets.jpg";
import masalaImg from "@/assets/cat-masala.jpg";
import pasteImg from "@/assets/cat-paste.jpg";

export type WeightVariant = {
  label: string;
  price: number;
};

export type Product = {
  id: string;
  name: string;
  category: string; // category slug
  isVeg: boolean;
  description: string;
  ingredients: string;
  price: number; // base price (250g)
  variants: WeightVariant[];
  image: string;
  gallery: string[];
  inStock: boolean;
  bestseller?: boolean;
  rating?: number;
};

export type Category = {
  slug: string;
  name: string;
  count: number;
  image: string;
  blurb: string;
};

export const categories: Category[] = [
  {
    slug: "non-veg-pickles",
    name: "Non-Veg Pickles",
    count: 31,
    image: nonVegImg,
    blurb: "Slow-cooked meat pickles in cold-pressed sesame oil",
  },
  {
    slug: "veg-pickles",
    name: "Veg Pickles",
    count: 35,
    image: vegImg,
    blurb: "Avakaya, gongura, garlic — sun-cured the old way",
  },
  {
    slug: "karapodulu",
    name: "Karapodulu / Spice Powders",
    count: 21,
    image: podiImg,
    blurb: "Stone-ground podis for hot rice and ghee",
  },
  {
    slug: "vadiyalu",
    name: "Vadiyalu",
    count: 13,
    image: vadiyaluImg,
    blurb: "Sun-dried fryums made on terrace cloth",
  },
  {
    slug: "cooking-powders",
    name: "Powders / Cooking Products",
    count: 4,
    image: masalaImg,
    blurb: "Everyday rasam and sambar essentials",
  },
  {
    slug: "sweets-snacks",
    name: "Sweets & Snacks",
    count: 35,
    image: sweetsImg,
    blurb: "Festive murukku, ariselu and laddus",
  },
  {
    slug: "masalas",
    name: "Masalas",
    count: 6,
    image: masalaImg,
    blurb: "Freshly roasted blends for curries",
  },
  {
    slug: "spice-powders",
    name: "Spice Powders",
    count: 3,
    image: podiImg,
    blurb: "Single-origin, unadulterated pure spice",
  },
  {
    slug: "cooking-pastes",
    name: "Cooking Pastes",
    count: 5,
    image: pasteImg,
    blurb: "Ready pastes for one-pot Andhra meals",
  },
  {
    slug: "premium-sweets",
    name: "Sweets & Premium Products",
    count: 4,
    image: sweetsImg,
    blurb: "Putharekulu, ulavacharu and gift boxes",
  },
];

const v = (p250: number): WeightVariant[] => [
  { label: "250g", price: p250 },
  { label: "500g", price: Math.round(p250 * 1.9) },
  { label: "1kg", price: Math.round(p250 * 3.6) },
];

type Seed = {
  id: string;
  name: string;
  category: string;
  isVeg: boolean;
  price: number;
  description: string;
  ingredients: string;
  image: string;
  inStock?: boolean;
  bestseller?: boolean;
  rating?: number;
};

const seeds: Seed[] = [
  // Non-veg pickles
  {
    id: "nv-chicken-pickle",
    name: "Andhra Chicken Pickle",
    category: "non-veg-pickles",
    isVeg: false,
    price: 449,
    description:
      "Boneless country chicken slow-cooked in sesame oil with hand-pounded chilli and garlic, matured for seven days before it reaches your jar.",
    ingredients: "Chicken, sesame oil, red chilli, garlic, ginger, mustard, fenugreek, salt.",
    image: nonVegImg,
    bestseller: true,
    rating: 4.8,
  },
  {
    id: "nv-mutton-pickle",
    name: "Naati Mutton Pickle",
    category: "non-veg-pickles",
    isVeg: false,
    price: 629,
    description:
      "Tender goat meat cubes cooked down till the oil separates, spiced the way Guntur grandmothers have for generations.",
    ingredients: "Mutton, sesame oil, red chilli, garlic, ginger, spices, salt.",
    image: nonVegImg,
    bestseller: true,
    rating: 4.9,
  },
  {
    id: "nv-prawns-pickle",
    name: "Royyala (Prawns) Pickle",
    category: "non-veg-pickles",
    isVeg: false,
    price: 549,
    description:
      "Coastal prawns cleaned by hand and fried crisp before pickling — deeply savoury with a slow-building heat.",
    ingredients: "Prawns, sesame oil, red chilli, tamarind, garlic, spices, salt.",
    image: nonVegImg,
    rating: 4.7,
  },
  {
    id: "nv-fish-pickle",
    name: "Chepa (Fish) Pickle",
    category: "non-veg-pickles",
    isVeg: false,
    price: 499,
    description: "Boneless fish chunks in a tangy tamarind-chilli base. A Godavari delta classic.",
    ingredients: "Fish, sesame oil, tamarind, red chilli, garlic, spices, salt.",
    image: nonVegImg,
    rating: 4.6,
  },
  // Veg pickles
  {
    id: "vp-mango-avakaya",
    name: "Mango Avakaya",
    category: "veg-pickles",
    isVeg: true,
    price: 279,
    description:
      "The queen of Andhra pickles. Raw Banginapalli mango, mustard powder and Guntur chilli, cured in generous sesame oil.",
    ingredients: "Raw mango, mustard powder, red chilli powder, sesame oil, salt.",
    image: vegImg,
    bestseller: true,
    rating: 4.9,
  },
  {
    id: "vp-garlic-pickle",
    name: "Garlic (Vellulli) Pickle",
    category: "veg-pickles",
    isVeg: true,
    price: 299,
    description: "Whole peeled garlic pods softened in spiced oil — pungent, warming and long-keeping.",
    ingredients: "Garlic, sesame oil, red chilli, tamarind, mustard, salt.",
    image: vegImg,
    bestseller: true,
    rating: 4.7,
  },
  {
    id: "vp-lemon-pickle",
    name: "Lemon (Nimmakaya) Pickle",
    category: "veg-pickles",
    isVeg: true,
    price: 249,
    description: "Sun-cured lemon wedges, bright and salty-sour. Perfect with curd rice.",
    ingredients: "Lemon, red chilli powder, fenugreek, turmeric, salt.",
    image: vegImg,
    rating: 4.6,
  },
  {
    id: "vp-mixed-veg-pickle",
    name: "Mixed Vegetable Pickle",
    category: "veg-pickles",
    isVeg: true,
    price: 269,
    description: "Carrot, gooseberry, green chilli and mango in one jar — the everyday all-rounder.",
    ingredients: "Mixed vegetables, sesame oil, chilli, mustard, spices, salt.",
    image: vegImg,
    rating: 4.5,
  },
  // Karapodulu
  {
    id: "kp-idli-karam",
    name: "Idli Karam Podi",
    category: "karapodulu",
    isVeg: true,
    price: 199,
    description: "Roasted lentils and chilli ground coarse. Mix with a spoon of ghee for idli and dosa.",
    ingredients: "Bengal gram, black gram, red chilli, sesame, asafoetida, salt.",
    image: podiImg,
    bestseller: true,
    rating: 4.8,
  },
  {
    id: "kp-gongura-podi",
    name: "Gongura Karam Podi",
    category: "karapodulu",
    isVeg: true,
    price: 229,
    description: "Sun-dried sorrel leaves ground with chilli — sharp, sour and unmistakably Telugu.",
    ingredients: "Gongura leaves, red chilli, garlic, cumin, salt.",
    image: podiImg,
    rating: 4.7,
  },
  {
    id: "kp-peanut-podi",
    name: "Peanut (Palli) Karam Podi",
    category: "karapodulu",
    isVeg: true,
    price: 189,
    description: "Roasted groundnuts with garlic and chilli. Nutty, mild and a favourite with kids.",
    ingredients: "Groundnut, red chilli, garlic, cumin, salt.",
    image: podiImg,
    rating: 4.6,
  },
  // Vadiyalu
  {
    id: "vd-rice-vadiyalu",
    name: "Rice Vadiyalu",
    category: "vadiyalu",
    isVeg: true,
    price: 179,
    description: "Rice batter discs dried under three days of summer sun. Fry till they puff.",
    ingredients: "Rice flour, cumin, green chilli, salt.",
    image: vadiyaluImg,
    rating: 4.5,
  },
  {
    id: "vd-carrot-vadiyalu",
    name: "Carrot Vadiyalu",
    category: "vadiyalu",
    isVeg: true,
    price: 199,
    description: "Grated carrot folded into sago batter for a sweet-savoury crunch.",
    ingredients: "Carrot, sago, rice flour, chilli, salt.",
    image: vadiyaluImg,
    rating: 4.4,
  },
  {
    id: "vd-ragi-vadiyalu",
    name: "Ragi Vadiyalu",
    category: "vadiyalu",
    isVeg: true,
    price: 209,
    description: "Finger millet vadiyalu — earthy, wholesome and lighter on the stomach.",
    ingredients: "Ragi flour, cumin, chilli, salt.",
    image: vadiyaluImg,
    rating: 4.4,
  },
  // Cooking powders
  {
    id: "cp-rasam-powder",
    name: "Rasam Powder",
    category: "cooking-powders",
    isVeg: true,
    price: 169,
    description: "Coriander, pepper and cumin roasted separately then blended — a fragrant rasam every time.",
    ingredients: "Coriander, pepper, cumin, red chilli, toor dal.",
    image: masalaImg,
    rating: 4.7,
  },
  {
    id: "cp-sambar-powder",
    name: "Sambar Powder",
    category: "cooking-powders",
    isVeg: true,
    price: 179,
    description: "A balanced house blend with just enough heat to carry vegetables and tamarind.",
    ingredients: "Coriander, red chilli, chana dal, fenugreek, curry leaves.",
    image: masalaImg,
    rating: 4.6,
  },
  // Sweets & snacks
  {
    id: "ss-ribbon-murukku",
    name: "Ribbon Murukku",
    category: "sweets-snacks",
    isVeg: true,
    price: 189,
    description: "Crisp ribbons of rice and gram flour, fried fresh in small batches every morning.",
    ingredients: "Rice flour, gram flour, butter, chilli, sesame, salt.",
    image: sweetsImg,
    bestseller: true,
    rating: 4.7,
  },
  {
    id: "ss-ariselu",
    name: "Ariselu",
    category: "sweets-snacks",
    isVeg: true,
    price: 349,
    description: "Jaggery and rice flour discs made only at festival time. Soft in the centre, sesame on top.",
    ingredients: "Rice flour, jaggery, sesame, ghee.",
    image: sweetsImg,
    bestseller: true,
    rating: 4.8,
  },
  {
    id: "ss-boondi-laddu",
    name: "Boondi Laddu",
    category: "sweets-snacks",
    isVeg: true,
    price: 329,
    description: "Ghee-rich laddus with cashew and cardamom, rolled by hand.",
    ingredients: "Gram flour, sugar, ghee, cashew, cardamom.",
    image: sweetsImg,
    rating: 4.7,
  },
  {
    id: "ss-chekkalu",
    name: "Chekkalu",
    category: "sweets-snacks",
    isVeg: true,
    price: 179,
    description: "Thin rice crackers studded with chana dal and curry leaf. Impossible to stop at one.",
    ingredients: "Rice flour, chana dal, curry leaves, chilli, salt.",
    image: sweetsImg,
    rating: 4.5,
  },
  // Masalas
  {
    id: "ms-chicken-masala",
    name: "Chicken Masala",
    category: "masalas",
    isVeg: true,
    price: 199,
    description: "A dark roasted blend built for country chicken curry and fry.",
    ingredients: "Coriander, chilli, pepper, cinnamon, clove, star anise.",
    image: masalaImg,
    rating: 4.6,
  },
  {
    id: "ms-mutton-masala",
    name: "Mutton Masala",
    category: "masalas",
    isVeg: true,
    price: 219,
    description: "Heavier on whole garam spices to stand up to slow-cooked mutton.",
    ingredients: "Coriander, chilli, cardamom, mace, cinnamon, clove.",
    image: masalaImg,
    rating: 4.6,
  },
  {
    id: "ms-turmeric-powder",
    name: "Turmeric Powder",
    category: "masalas",
    isVeg: true,
    price: 129,
    description: "Nizamabad turmeric, sun-dried and stone-ground. High colour, no fillers.",
    ingredients: "100% turmeric.",
    image: masalaImg,
    rating: 4.8,
  },
  // Spice powders
  {
    id: "sp-coriander-powder",
    name: "Coriander Powder",
    category: "spice-powders",
    isVeg: true,
    price: 119,
    description: "Freshly milled coriander seed with its aroma still intact.",
    ingredients: "100% coriander seed.",
    image: podiImg,
    rating: 4.6,
  },
  {
    id: "sp-cumin-powder",
    name: "Cumin Powder",
    category: "spice-powders",
    isVeg: true,
    price: 149,
    description: "Gently roasted cumin, ground fine for tempering and raitas.",
    ingredients: "100% cumin seed.",
    image: podiImg,
    rating: 4.5,
  },
  {
    id: "sp-red-chilli-powder",
    name: "Guntur Red Chilli Powder",
    category: "spice-powders",
    isVeg: true,
    price: 179,
    description: "Fiery Guntur Sannam chillies, stemmed by hand before grinding.",
    ingredients: "100% red chilli.",
    image: podiImg,
    bestseller: true,
    rating: 4.8,
  },
  // Cooking pastes
  {
    id: "pa-pulihora-paste",
    name: "Pulihora Paste",
    category: "cooking-pastes",
    isVeg: true,
    price: 239,
    description: "Tamarind tempering concentrate — stir a spoon into hot rice for instant pulihora.",
    ingredients: "Tamarind, sesame oil, peanuts, chana dal, chilli, turmeric.",
    image: pasteImg,
    rating: 4.7,
  },
  {
    id: "pa-gongura-paste",
    name: "Gongura Paste",
    category: "cooking-pastes",
    isVeg: true,
    price: 259,
    description: "Sorrel leaves cooked down with garlic — a base for mutton, prawns or plain dal.",
    ingredients: "Gongura, sesame oil, garlic, chilli, salt.",
    image: pasteImg,
    rating: 4.6,
  },
  {
    id: "pa-ginger-garlic-paste",
    name: "Ginger Garlic Paste",
    category: "cooking-pastes",
    isVeg: true,
    price: 149,
    description: "Equal parts fresh ginger and garlic, no water added.",
    ingredients: "Ginger, garlic, salt, edible oil.",
    image: pasteImg,
    rating: 4.4,
  },
  // Premium
  {
    id: "pr-putharekulu",
    name: "Putharekulu (Paper Sweet)",
    category: "premium-sweets",
    isVeg: true,
    price: 429,
    description: "Atreyapuram paper-thin rice sheets rolled with jaggery and ghee. Fragile, festive, unforgettable.",
    ingredients: "Rice starch sheets, jaggery, ghee, dry fruits.",
    image: sweetsImg,
    bestseller: true,
    rating: 4.9,
  },
  {
    id: "pr-ulavacharu",
    name: "Ulavacharu",
    category: "premium-sweets",
    isVeg: true,
    price: 389,
    description: "Horse gram broth reduced for hours to a dark, smoky concentrate.",
    ingredients: "Horse gram, tamarind, spices, salt.",
    image: pasteImg,
    rating: 4.7,
  },
  {
    id: "pr-dry-fruit-box",
    name: "Premium Dry Fruit Box",
    category: "premium-sweets",
    isVeg: true,
    price: 899,
    description: "A gifting box of almonds, cashews, pista and figs in a hand-tied wrap.",
    ingredients: "Almond, cashew, pistachio, fig.",
    image: sweetsImg,
    inStock: false,
    rating: 4.6,
  },
];

export const products: Product[] = seeds.map((s) => ({
  ...s,
  inStock: s.inStock ?? true,
  variants: v(s.price),
  gallery: [s.image, s.image, s.image],
}));

export const getProduct = (id: string) => products.find((p) => p.id === id);
export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
export const productsByCategory = (slug: string) => products.filter((p) => p.category === slug);
export const bestsellers = products.filter((p) => p.bestseller);

export const searchProducts = (q: string) => {
  const term = q.trim().toLowerCase();
  if (!term) return [];
  return products.filter(
    (p) => p.name.toLowerCase().includes(term) || p.description.toLowerCase().includes(term),
  );
};

export const formatINR = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export const WHATSAPP_NUMBER = "919876543210";
