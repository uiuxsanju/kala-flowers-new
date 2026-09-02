import vegImg from "@/assets/cat-veg-pickle.webp";
import nonVegImg from "@/assets/cat-nonveg-pickle.webp";
import podiImg from "@/assets/cat-podi.webp";
import vadiyaluImg from "@/assets/cat-vadiyalu.webp";
import sweetsImg from "@/assets/cat-sweets.webp";
import masalaImg from "@/assets/cat-masala.webp";
import pasteImg from "@/assets/cat-paste.webp";
import cookingPowdersImg from "@/assets/cat-cooking-powders.webp";
import premiumSweetsImg from "@/assets/cat-premium-sweets.webp";
import bakeryDryFruitsImg from "@/assets/cat-bakery-dry-fruits.webp";
import premiumSpicesImg from "@/assets/cat-premium-spices.webp";


// ---------------------------------------------------------------------------
// PRODUCT IMAGES — auto-loaded from src/assets/products/*.webp
// ---------------------------------------------------------------------------
// HOW TO ADD A PRODUCT PHOTO:
//   1. Convert the photo to .webp
//   2. Name the file EXACTLY the product's name in PascalCase, no spaces:
//        "Mutton Pickle"          -> MuttonPickle.webp
//
//        "Murrel Fish (Boneless)" -> MurrelFishBoneless.webp
//   3. Drop it in:  src/assets/products/
// That's it — NO code change needed. import.meta.glob below scans that
// folder at build time and wires it up automatically. A product with no
// matching file just keeps showing its category's default photo (no error,
// no broken image, nothing breaks) until you add the file.
//
// If you want a specific product to use a different file name than the
// auto convention above, add `imageFile: "SomeOtherName.webp"` to that
// product's entry further down in this file.
const productImageModules = import.meta.glob("/src/assets/products/*.webp", {
  eager: true,
  import: "default",
}) as Record<string, string>;

function toPascalFileName(name: string): string {
  return name
    .replace(/[()]/g, "")
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");
}

function productImageUrl(fileName: string): string | undefined {
  return productImageModules[`/src/assets/products/${fileName}`];
}

export type WeightVariant = {
  label: string;
  price: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  nameTelugu: string;
  category: string; // category slug
  isVeg: boolean;
  description: string;
  shortDescription: string;
  ingredients: string;
  price: number; // price of the smallest available pack
  originalPrice?: number;
  discount?: number; // percent off, derived from originalPrice
  variants: WeightVariant[];
  image: string;
  gallery: string[];
  inStock: boolean;
  bestseller?: boolean;
  featured?: boolean;
  rating: number;
  reviewCount: number;
  tags: string[];
  subCategory?: string; // optional filter within a category, e.g. "Biryani Spices" inside "premium-spices"
};

export type Category = {
  slug: string;
  name: string;
  count: number;
  image: string;
  blurb: string;
};

// ---------------------------------------------------------------------------
// Categories (count is computed below, after the full catalogue is built)
// ---------------------------------------------------------------------------

const categoriesBase: Omit<Category, "count">[] = [
  {
    slug: "non-veg-pickles",
    name: "Non-Veg Pickles",
    image: nonVegImg,
    blurb: "Slow-cooked meat pickles in cold-pressed sesame oil",
  },
  {
    slug: "veg-pickles",
    name: "Veg Pickles",
    image: vegImg,
    blurb: "Avakaya, gongura, garlic — sun-cured the old way",
  },
  {
    slug: "karapodulu",
    name: "Karapodulu / Spice Powders",
    image: podiImg,
    blurb: "Stone-ground podis for hot rice and ghee",
  },
  {
    slug: "vadiyalu",
    name: "Vadiyalu",
    image: vadiyaluImg,
    blurb: "Sun-dried fryums made on terrace cloth",
  },
  {
    slug: "cooking-powders",
    name: "Powders / Cooking Products",
    image: cookingPowdersImg,
    blurb: "Everyday rasam, sambar and kura karam essentials",
  },
  {
    slug: "sweets-snacks",
    name: "Homemade Snacks",
    image: sweetsImg,
    blurb: "Festive murukku, mixture, chikki and laddus",
  },
  {
    slug: "masalas",
    name: "Masalas",
    image: masalaImg,
    blurb: "Freshly roasted blends for curries and fries",
  },
  {
    slug: "cooking-pastes",
    name: "Cooking Pastes",
    image: pasteImg,
    blurb: "Ready pastes for one-pot Andhra meals",
  },
  {
    slug: "premium-sweets",
    name: "Sweets & Premium Products",
    image: premiumSweetsImg,
    blurb: "Putharekulu, pure honey, ghee and festive gifting",
  },
  {
    slug: "bakery-dry-fruits",
    name: "Bakery & Dry Fruits",
    image: bakeryDryFruitsImg,
    blurb: "Fresh bakes and premium dry fruit gifting boxes",
  },
  {
    slug: "premium-spices",
    name: "Premium Spices",
    image: premiumSpicesImg,
    blurb: "Wholesale-grade whole spices, powders, dry fruits & herbs",
  },
];

// The 5 sub-categories shown as filters/tabs inside the Premium Spices
// category page (not separate top-level category cards — there's only one
// photo, cat-premium-spices.webp, for the whole section).
export const PREMIUM_SPICES_SUBCATEGORIES = [
  "Premium Whole Spices",
  "Biryani Spices",
  "Spice Powders",
  "Dry Fruits & Seeds",
  "Herbs & Special Ingredients",
] as const;

// ---------------------------------------------------------------------------
// Weight-variant generation
// ---------------------------------------------------------------------------
// Every product is entered at ONE known price + weight ("unit", in grams).
// We generate a small/medium/large pack lineup for its size class and scale
// the price using a mild bulk-discount curve, so a doubling in weight costs
// a bit less than double (matching how these are actually priced today).

type SizeClass = "podi" | "standard" | "cake" | "large";

const SIZE_SETS: Record<SizeClass, number[]> = {
  podi: [100, 250, 500],
  standard: [250, 500, 1000],
  cake: [500, 1000, 1500],
  large: [1000, 2000, 3000],
};

const gramsLabel = (g: number) => {
  if (g >= 1000) {
    const kg = g / 1000;
    return `${Number.isInteger(kg) ? kg : kg.toFixed(1)}kg`;
  }
  return `${g}g`;
};

const ratioMultiplier = (ratio: number) => {
  if (ratio === 1) return 1;
  if (ratio > 1) return ratio * (1 - 0.05 * Math.log2(ratio));
  return ratio * (1 + 0.05 * Math.log2(1 / ratio));
};

const variantsFor = (unit: number, price: number, sizeClass: SizeClass): WeightVariant[] =>
  SIZE_SETS[sizeClass].map((g) => ({
    label: gramsLabel(g),
    price: Math.round(price * ratioMultiplier(g / unit)),
  }));

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[()]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-+|-+$)/g, "");

// Deterministic hash-based helpers so numbers stay stable across renders/SSR
// instead of using Math.random().
const reviewCountFor = (id: string) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return 38 + (hash % 260);
};

const ratingFor = (id: string) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 17 + id.charCodeAt(i)) >>> 0;
  return Math.round((4.3 + (hash % 5) * 0.1) * 10) / 10;
};

// ---------------------------------------------------------------------------
// English -> Telugu name translation
// ---------------------------------------------------------------------------
// Product names are entered in English below; this builds a Telugu version
// automatically for every product. If the auto-translation isn't quite right
// for a specific item, just add a `nameTelugu` field on that RawItem entry —
// it will be used instead of the automatic one.

// Multi-word phrases that don't translate correctly word-by-word.
// Checked BEFORE the single-word map, so these win first.
const TELUGU_PHRASE_OVERRIDES: [string, string][] = [
  ["elephant foot yam", "కంద"],
  ["white bait fish", "వైట్ బెయిట్ చేప"],
  ["sea bass fish", "సీ బాస్ చేప"],
  ["white bait", "వైట్ బెయిట్"],
  ["sea bass", "సీ బాస్"],
  ["bitter gourd", "కాకరకాయ"],
  ["curry leaves", "కరివేపాకు"],
  ["drumstick leaves", "మునగాకు"],
  ["broad beans", "చిక్కుడు"],
  ["veld grape", "కాకి మొక్క"],
  ["mixed veg", "కూరగాయల మిశ్రమం"],
  ["all mixture", "అన్ని రకాల మిక్స్చర్"],
  ["dry fruits", "డ్రై ఫ్రూట్స్"],
  ["dry fruit", "డ్రై ఫ్రూట్"],
];

// Single-word dictionary (lowercase key). Any word not found is left as-is.
const TELUGU_WORD_MAP: Record<string, string> = {
  chicken: "చికెన్",
  pickle: "పచ్చడి",
  boneless: "ఎముక లేని",
  bone: "ఎముకతో",
  country: "నాటు",
  cashew: "జీడిపప్పు",
  kheema: "కీమా",
  joint: "జాయింట్",
  biryani: "బిర్యానీ",
  mutton: "మటన్",
  small: "చిన్న",
  prawns: "రొయ్యలు",
  large: "పెద్ద",
  murrel: "కొర్రమేను",
  fish: "చేప",
  sea: "సముద్ర",
  bass: "బాస్",
  crab: "పీత",
  pond: "చెరువు",
  white: "తెలుపు",
  bait: "బెయిట్",
  apollo: "అపోలో",
  Gongura: "గోంగూర",
  boti: "బోటి",
  gongura: "గోంగూర",
  extra: "ఎక్స్ట్రా",
  mango: "మామిడి",
  avakaya: "ఆవకాయ",
  jaggery: "బెల్లం",
  ginger: "అల్లం",
  cut: "ముక్కల",
  grated: "తురిమిన",
  amla: "ఉసిరి",
  garlic: "వెల్లుల్లి",
  drumstick: "మునగకాడ",
  lemon: "నిమ్మకాయ",
  tomato: "టమాట",
  red: "ఎర్ర",
  chilli: "మిర్చి",
  tamarind: "చింతపండు",
  raw: "పచ్చి",
  green: "పచ్చి",
  bitter: "చేదు",
  gourd: "కాయ",
  citron: "మాదీఫలం",
  brinjal: "వంకాయ",
  leaves: "ఆకులు",
  coriander: "కొత్తిమీర",
  curry: "కరివేపాకు",
  mint: "పుదీనా",
  mixed: "మిక్స్డ్",
  veg: "కూరగాయల",
  banana: "అరటికాయ",
  carrot: "క్యారెట్",
  beetroot: "బీట్‌రూట్",
  cauliflower: "కాలీఫ్లవర్",
  veld: "కాకి",
  grape: "మొక్క",
  elephant: "ఏనుగు",
  foot: "కాలు",
  yam: "కంద",
  broad: "వెడల్పు",
  beans: "చిక్కుడు",
  rice: "బియ్యం",
  idly: "ఇడ్లీ",
  toor: "కంది",
  dal: "పప్పు",
  groundnut: "వేరుశనగ",
  sesame: "నువ్వులు",
  roasted: "వేయించిన",
  nallera: "నల్లేరు",
  flax: "అవిసె",
  seeds: "గింజలు",
  dry: "ఎండు",
  minapa: "మినప",
  kobbari: "కొబ్బరి",
  sonti: "సొంఠి",
  nalla: "నల్ల",
  karam: "కారం",
  podi: "పొడి",
  karappodi: "కారప్పొడి",
  ragi: "రాగి",
  moong: "పెసర",
  urad: "మినప",
  challa: "చల్ల",
  mirchi: "మిర్చి",
  pumpkin: "గుమ్మడికాయ",
  vadiyalu: "వడియాలు",
  rasam: "రసం",
  sambar: "సాంబార్",
  turmeric: "పసుపు",
  powder: "పొడి",
  kura: "కూర",
  kebab: "కబాబ్",
  masala: "మసాలా",
  menthu: "మెంతి",
  dhaniya: "ధనియాలు",
  jeera: "జీలకర్ర",
  pulihora: "పులిహోర",
  pudhina: "పుదీనా",
  kothimeera: "కొత్తిమీర",
  ulavacharu: "ఉలవచారు",
  paste: "పేస్ట్",
  putharekulu: "పూతరేకులు",
  pure: "స్వచ్ఛమైన",
  honey: "తేనె",
  ghee: "నెయ్యి",
  fruit: "ఫ్రూట్",
  fruits: "ఫ్రూట్స్",
  laddu: "లడ్డు",
  mamidi: "మామిడి",
  thandra: "తాండ్ర",
  sugar: "చక్కెర",
  bellam: "బెల్లం",
  thati: "తాటి",
  ribbon: "రిబ్బన్",
  murukulu: "మురుకులు",
  dootha: "దూత",
  pakodi: "పకోడి",
  atukula: "అటుకుల",
  mixture: "మిక్స్చర్",
  lavu: "లావు",
  karapusa: "కారప్పూస",
  sanna: "సన్న",
  palli: "పల్లీ",
  jantikalu: "జంతికలు",
  baru: "బారు",
  round: "రౌండ్",
  cornflakes: "కార్న్‌ఫ్లేక్స్",
  kara: "కారం",
  boondi: "బూంది",
  all: "అన్ని",
  chegodilu: "చెగోడీలు",
  mudi: "ముడి",
  kabuli: "కాబూలీ",
  chana: "శనగలు",
  chekkalu: "చెక్కలు",
  chikki: "చిక్కీ",
  kommulu: "కమ్ములు",
  gavvalu: "గవ్వలు",
  gorumitlu: "గోరుమిట్లు",
  ariselu: "అరిసెలు",
  nuvvula: "నువ్వుల",
  sweet: "స్వీట్",
  venna: "వెన్న",
  golilu: "గోళీలు",
  coconut: "కొబ్బరి",
  pastry: "పేస్ట్రీ",
  cake: "కేక్",
};

function translateToTelugu(name: string): string {
  // Pull a trailing "(...)" qualifier out, e.g. "Murrel Fish (Boneless)",
  // and translate it separately so the parentheses are preserved.
  const parenMatch = name.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
  const main = parenMatch ? parenMatch[1] : name;
  const paren = parenMatch ? parenMatch[2] : null;

  const translateChunk = (chunk: string): string => {
    let lower = chunk.toLowerCase();
    for (const [phrase, telugu] of TELUGU_PHRASE_OVERRIDES) {
      const re = new RegExp(`\\b${phrase}\\b`, "gi");
      if (re.test(lower)) lower = lower.replace(re, `@@${telugu}@@`);
    }
    return lower
      .split(/(@@[^@]+@@)/g)
      .map((part) => {
        if (part.startsWith("@@") && part.endsWith("@@")) return part.slice(2, -2);
        return part
          .split(/\s+/)
          .filter(Boolean)
          .map((w) => TELUGU_WORD_MAP[w.replace(/[^a-z]/g, "")] ?? w)
          .join(" ");
      })
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
  };

  const mainTelugu = translateChunk(main ?? name);
  if (paren) return `${mainTelugu} (${translateChunk(paren)})`;
  return mainTelugu;
}

// ---------------------------------------------------------------------------
// Description / ingredients auto-generation (keyword-aware per category)
// ---------------------------------------------------------------------------

type BlockKind =
  | "non-veg"
  | "veg"
  | "karapodulu"
  | "vadiyalu"
  | "cooking-powders"
  | "masalas"
  | "spice-powders"
  | "cooking-pastes"
  | "premium-sweets"
  | "sweets-snacks"
  | "bakery";

function describeNonVeg(name: string): string {
  const n = name.toLowerCase();
  let protein = "Country meat";
  if (n.includes("chicken")) protein = "Country chicken";
  if (n.includes("mutton")) protein = "Goat mutton";
  if (n.includes("prawn")) protein = "Coastal prawns";
  if (n.includes("crab")) protein = "Crab meat";
  if (
    n.includes("fish") ||
    n.includes("murrel") ||
    n.includes("bass") ||
    n.includes("bait") ||
    n.includes("apollo") ||
    n.includes("pond")
  )
    protein = "Fresh fish";
  const gongura = n.includes("gongura") || n.includes("Gongura");
  const kheema = n.includes("kheema");
  const boti = n.includes("boti");
  const boneless = n.includes("boneless");
  const extra = n.includes("extra");
  const cut = kheema
    ? "minced fine"
    : boti
      ? "tripe, cut into bite-sized pieces"
      : boneless
        ? "cleaned and deboned"
        : "cut on the bone for deeper flavour";
  const flavour = gongura
    ? "cooked down with tangy sun-dried gongura leaves for a sharp, sour edge"
    : "slow-cooked in cold-pressed sesame oil with Guntur chilli and hand-ground spices";
  const heat = extra ? " Made extra spicy for those who like it hot." : "";
  return `${protein}, ${cut}, ${flavour}.${heat} Matured for a few days before it reaches your jar.`;
}

function ingredientsNonVeg(name: string): string {
  const n = name.toLowerCase();
  let protein = "Country meat";
  if (n.includes("chicken")) protein = "Chicken";
  if (n.includes("mutton")) protein = "Mutton";
  if (n.includes("prawn")) protein = "Prawns";
  if (n.includes("crab")) protein = "Crab";
  if (
    n.includes("fish") ||
    n.includes("murrel") ||
    n.includes("bass") ||
    n.includes("bait") ||
    n.includes("apollo") ||
    n.includes("pond")
  )
    protein = "Fish";
  const gongura = n.includes("Gongura") || n.includes("gongura") ? ", gongura leaves" : "";
  return `${protein}, sesame oil, red chilli${gongura}, garlic, ginger, mustard, fenugreek, salt.`;
}

const VEG_CORE_MAP: [string, string][] = [
  ["drumstick leaves", "Drumstick leaves"],
  ["mango ginger", "Mango ginger (adavi allam)"],
  ["mango", "Raw mango"],
  ["amla", "Tart gooseberry (amla)"],
  ["ginger", "Fresh ginger"],
  ["garlic", "Whole peeled garlic"],
  ["drumstick", "Tender drumstick"],
  ["lemon", "Sun-cured lemon"],
  ["tomato", "Ripe tomato"],
  ["tamarind", "Tangy tamarind"],
  ["red chilli", "Guntur red chilli"],
  ["green chilli", "Fresh green chilli"],
  ["bitter gourd", "Bitter gourd"],
  ["citron", "Citron"],
  ["brinjal", "Brinjal"],
  ["Gongura", "Sun-dried gongura leaves"],
  ["coriander", "Fresh coriander"],
  ["curry leaves", "Curry leaves"],
  ["mint", "Mint leaves"],
  ["mixed veg", "A mix of seasonal vegetables"],
  ["banana", "Raw banana"],
  ["carrot", "Fresh carrot"],
  ["beetroot", "Fresh beetroot"],
  ["cauliflower", "Cauliflower"],
  ["veld grape", "Veld grape (kaki mokka)"],
  ["elephant foot", "Elephant foot yam"],
  ["yam", "Elephant foot yam"],
  ["broad beans", "Broad beans (chikkudu)"],
];

function describeVeg(name: string): string {
  const n = name.toLowerCase();
  let core = "Fresh vegetables";
  for (const [k, v] of VEG_CORE_MAP) {
    if (n.includes(k)) {
      core = v;
      break;
    }
  }
  const style = n.includes("jaggery")
    ? "sweetened with jaggery for a milder finish"
    : n.includes("biryani")
      ? "spiced the way it's stirred through hot biryani"
      : n.includes("grated")
        ? "grated fine and quick-cured"
        : n.includes("small cut")
          ? "cut small for an everyday jar"
          : "cured the traditional way in mustard and red chilli";
  return `${core}, ${style} with cold-pressed sesame oil and a pinch of asafoetida.`;
}

function ingredientsVeg(name: string): string {
  const n = name.toLowerCase();
  let core = "Mixed vegetables";
  for (const [k, v] of VEG_CORE_MAP) {
    if (n.includes(k)) {
      core = v;
      break;
    }
  }
  const jaggery = n.includes("jaggery") ? "jaggery, " : "";
  return `${core}, ${jaggery}mustard powder, red chilli powder, sesame oil, salt.`;
}

function describePodi(
  name: string,
  kind: "karapodulu" | "vadiyalu" | "cooking-powders" | "spice-powders" | "masalas",
): string {
  if (kind === "vadiyalu")
    return `${name}, sun-dried the traditional way on cotton cloth until crisp. Deep-fry a few straight from the pack for a crunchy side with rice and dal.`;
  if (kind === "spice-powders")
    return `${name}, single-ingredient and stone-ground with nothing added — just the spice, roasted and milled fresh.`;
  if (kind === "masalas")
    return `${name}, a dark roasted spice blend built for authentic Andhra-style curries and fries.`;
  if (kind === "cooking-powders") {
    const n = name.toLowerCase();
    if (n.includes("challa") || n.includes("mirchi"))
      return `${name}, sun-dried green chillies soaked in spiced buttermilk, ready to deep-fry as a crunchy side for curd rice.`;
    return `${name}, roasted and ground fresh for everyday South Indian cooking.`;
  }
  return `${name}, dry-roasted lentils and chilli ground the traditional way. Mix with a spoon of ghee or oil and serve with hot rice, idli or dosa.`;
}

function ingredientsPodi(
  name: string,
  kind: "karapodulu" | "vadiyalu" | "cooking-powders" | "spice-powders" | "masalas",
): string {
  const n = name.toLowerCase();
  if (kind === "vadiyalu") {
    let base = "Rice flour";
    if (n.includes("ragi")) base = "Ragi flour";
    if (n.includes("moong")) base = "Moong dal batter";
    if (n.includes("urad")) base = "Urad dal batter";
    if (n.includes("pumpkin")) base = "Pumpkin, sago";
    if (n.includes("challa") || n.includes("mirchi")) base = "Green chilli, gram flour batter";
    return `${base}, cumin, chilli, salt — sun-dried.`;
  }
  if (kind === "spice-powders") {
    if (n.includes("menthu") || n.includes("fenugreek")) return "100% fenugreek seed.";
    if (n.includes("dhaniya") || n.includes("coriander")) return "100% coriander seed.";
    if (n.includes("jeera") || n.includes("cumin")) return "100% cumin seed.";
    return "100% single-origin spice.";
  }
  if (kind === "masalas") return "Coriander, red chilli, pepper, cinnamon, clove, cumin, salt.";
  if (kind === "cooking-powders") {
    if (n.includes("challa") || n.includes("mirchi"))
      return "Green chilli, spiced buttermilk, salt — sun-dried.";
    if (n.includes("rasam")) return "Coriander, pepper, cumin, red chilli, toor dal.";
    if (n.includes("sambar")) return "Coriander, red chilli, chana dal, fenugreek, curry leaves.";
    if (n.includes("turmeric")) return "100% turmeric.";
    if (n.includes("kura karam")) return "Red chilli, coriander seed, garlic, salt.";
    return "Roasted lentils, spices, salt.";
  }
  // karapodulu
  if (n.includes("prawns")) return "Dry prawns, red chilli, garlic, salt.";
  if (n.includes("sesame")) return "Sesame seeds, red chilli, garlic, salt.";
  if (n.includes("groundnut") || n.includes("peanut"))
    return "Roasted peanuts, red chilli, garlic, salt.";
  if (n.includes("flax")) return "Flax seeds, red chilli, garlic, salt.";
  if (n.includes("kobbari") || n.includes("coconut"))
    return "Dry coconut, red chilli, garlic, salt.";
  if (n.includes("sonti")) return "Dry ginger, jaggery, spices.";
  if (n.includes("amla")) return "Dried amla, red chilli, salt.";
  if (n.includes("minapa")) return "Urad dal, red chilli, garlic, salt.";
  if (n.includes("naller")) return "Nalleru (veld grape), red chilli, tamarind, salt.";
  return "Roasted lentils, dried red chilli, curry leaves, asafoetida, salt.";
}

function describeSweet(name: string): string {
  return `${name}, made fresh in small batches the way festival snacks are made at home.`;
}

function ingredientsSweet(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("laddu")) return "Gram flour or lentils, jaggery or sugar, ghee, cardamom.";
  if (n.includes("chikki")) return "Peanuts or sesame, jaggery.";
  if (n.includes("murukk") || n.includes("jantik") || n.includes("chegodi"))
    return "Rice flour, gram flour, butter, sesame, chilli, salt.";
  if (n.includes("boondi")) return "Gram flour, sugar or salt and spices, ghee.";
  if (n.includes("ariselu")) return "Rice flour, jaggery, sesame, ghee.";
  if (n.includes("mixture") || n.includes("pakodi") || n.includes("karapusa"))
    return "Rice flakes, lentils, peanuts, curry leaves, spices, oil.";
  if (n.includes("gorumitlu")) return "Rice flour, jaggery or sugar, ghee.";
  if (n.includes("gavvalu")) return "Rice flour, sugar, ghee.";
  if (n.includes("kommulu")) return "Rice flour, jaggery, sesame, ghee.";
  if (n.includes("kabuli chana")) return "Kabuli chana, spices, oil, salt.";
  return "Rice flour, gram flour, jaggery or sugar, ghee, spices.";
}

function describePaste(name: string): string {
  return `${name}, slow-cooked into a ready-to-use base — just stir a spoon into hot rice or curry.`;
}

function ingredientsPaste(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("pulihora")) return "Tamarind, sesame oil, peanuts, chana dal, chilli, turmeric.";
  if (n.includes("tomato")) return "Tomato, sesame oil, garlic, chilli, salt.";
  if (n.includes("pudhina") || n.includes("mint"))
    return "Mint leaves, green chilli, garlic, oil, salt.";
  if (n.includes("kothimeera") || n.includes("coriander"))
    return "Coriander leaves, green chilli, garlic, oil, salt.";
  if (n.includes("gongura")) return "Gongura, sesame oil, garlic, chilli, salt.";
  if (n.includes("ulavacharu")) return "Horse gram, tamarind, spices, salt.";
  return "Fresh herbs, oil, garlic, salt.";
}

function describePremium(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("honey"))
    return `${name}, raw and unprocessed — straight from the comb to the jar.`;
  if (n.includes("ghee"))
    return `${name}, slow-simmered from fresh cream the traditional bilona way.`;
  return `${name}, a festive specialty made in small batches for gifting and special occasions.`;
}

function ingredientsPremium(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("honey")) return "100% raw honey.";
  if (n.includes("ghee")) return "100% cow's milk ghee.";
  if (n.includes("putharekulu")) return "Rice starch sheets, jaggery, ghee, dry fruits.";
  if (n.includes("thandra")) return "Raw mango or palm pulp, jaggery or sugar, sun-dried.";
  if (n.includes("laddu")) return "Lentils or dry fruits, jaggery, ghee, cardamom.";
  return "Traditional ingredients, ghee, jaggery.";
}

function describeBakery(name: string): string {
  return `${name}, freshly packed and perfect for gifting or a treat with evening chai.`;
}

function ingredientsBakery(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("cake"))
    return "Refined flour, sugar, butter, eggs or egg substitute, flavouring.";
  return "Assorted almonds, cashews, pistachio, raisins, figs.";
}

function describeFor(kind: BlockKind, name: string): string {
  switch (kind) {
    case "non-veg":
      return describeNonVeg(name);
    case "veg":
      return describeVeg(name);
    case "vadiyalu":
      return describePodi(name, "vadiyalu");
    case "cooking-powders":
      return describePodi(name, "cooking-powders");
    case "masalas":
      return describePodi(name, "masalas");
    case "spice-powders":
      return describePodi(name, "spice-powders");
    case "karapodulu":
      return describePodi(name, "karapodulu");
    case "cooking-pastes":
      return describePaste(name);
    case "premium-sweets":
      return describePremium(name);
    case "sweets-snacks":
      return describeSweet(name);
    case "bakery":
      return describeBakery(name);
  }
}

function ingredientsFor(kind: BlockKind, name: string): string {
  switch (kind) {
    case "non-veg":
      return ingredientsNonVeg(name);
    case "veg":
      return ingredientsVeg(name);
    case "vadiyalu":
      return ingredientsPodi(name, "vadiyalu");
    case "cooking-powders":
      return ingredientsPodi(name, "cooking-powders");
    case "masalas":
      return ingredientsPodi(name, "masalas");
    case "spice-powders":
      return ingredientsPodi(name, "spice-powders");
    case "karapodulu":
      return ingredientsPodi(name, "karapodulu");
    case "cooking-pastes":
      return ingredientsPaste(name);
    case "premium-sweets":
      return ingredientsPremium(name);
    case "sweets-snacks":
      return ingredientsSweet(name);
    case "bakery":
      return ingredientsBakery(name);
  }
}

// ---------------------------------------------------------------------------
// Catalogue data
// ---------------------------------------------------------------------------

type RawItem = {
  name: string;
  price: number;
  unit: number; // grams the given price corresponds to
  isVeg?: boolean;
  bestseller?: boolean;
  rating?: number;
  originalPrice?: number;
  inStock?: boolean;
  imageFile?: string; // optional: custom webp filename (in src/assets/products/) instead of the auto PascalCase one
  image?: string; // optional: full manual override (imported image or path), takes priority over imageFile
  nameTelugu?: string; // optional manual override for the auto-translated Telugu name
};

function buildBlock(
  category: string,
  idPrefix: string,
  sizeClass: SizeClass,
  defaultVeg: boolean,
  kind: BlockKind,
  items: RawItem[],
): Product[] {
  const categoryMeta = categoriesBase.find((c) => c.slug === category);
  const categoryName = categoryMeta?.name ?? "";
  const categoryImage = categoryMeta?.image ?? "";
  return items.map((it) => {
    const id = `${idPrefix}-${slugify(it.name)}`;
    const variants = variantsFor(it.unit, it.price, sizeClass);
    const price = variants[0]!.price;
    const discount = it.originalPrice
      ? Math.round(((it.originalPrice - it.price) / it.originalPrice) * 100)
      : undefined;
    const isVeg = it.isVeg ?? defaultVeg;
    const description = describeFor(kind, it.name);
    // Priority: explicit `image` override -> matching webp in src/assets/products/
    // (auto or custom filename) -> the category's default photo.
    const autoFileName = it.imageFile ?? `${toPascalFileName(it.name)}.webp`;
    const productImage = it.image ?? productImageUrl(autoFileName) ?? categoryImage;
    return {
      id,
      slug: id,
      name: it.name,
      nameTelugu: it.nameTelugu ?? translateToTelugu(it.name),
      category,
      isVeg,
      description,
      shortDescription: (description.split(". ")[0] ?? description).replace(/\.$/, "") + ".",
      ingredients: ingredientsFor(kind, it.name),
      price,
      ...(it.originalPrice !== undefined ? { originalPrice: it.originalPrice } : {}),
      ...(discount !== undefined ? { discount } : {}),
      variants,
      image: productImage,
      gallery: [productImage, productImage, productImage],
      inStock: it.inStock ?? true,
      bestseller: it.bestseller ?? false,
      featured: it.bestseller ?? false,
      rating: it.rating ?? ratingFor(id),
      reviewCount: reviewCountFor(id),
      tags: [
        category,
        categoryName,
        isVeg ? "veg" : "non-veg",
        ...(it.bestseller ? ["bestseller"] : []),
      ].filter(Boolean),
    };
  });
}

// --- 1. Non-Veg Pickles (250g) ----------------------------------------------
const NON_VEG_ITEMS: RawItem[] = [
  {
    name: "Chicken Pickle",
    price: 245,
    unit: 250,
    bestseller: true,
    originalPrice: 275,
    rating: 4.8,
  },
  { name: "Boneless Chicken Pickle", price: 290, unit: 250 },
  { name: "Country Chicken Pickle", price: 330, unit: 250, bestseller: true, rating: 4.9 },
  { name: "Cashew Chicken Kheema", price: 310, unit: 250 },
  { name: "Mutton Pickle", price: 405, unit: 250, bestseller: true, rating: 4.8 },
  { name: "Boneless Mutton Pickle", price: 455, unit: 250 },
  { name: "Mutton Kheema Pickle", price: 455, unit: 250 },
  { name: "Small Prawns Pickle", price: 370, unit: 250 },
  { name: "Large Prawns Pickle", price: 410, unit: 250, bestseller: true, rating: 4.7 },
  { name: "Murrel Fish (Boneless)", price: 395, unit: 250 },
  { name: "Murrel Fish (Bone)", price: 360, unit: 250 },
  { name: "Sea Bass Fish Pickle", price: 480, unit: 250 },
  { name: "Crab Pickle", price: 310, unit: 250 },
  { name: "Pond Fish Pickle", price: 295, unit: 250 },
  { name: "White Bait Fish", price: 295, unit: 250 },
  { name: "Apollo Fish Pickle", price: 385, unit: 250 },
  { name: "Gongura Chicken", price: 245, unit: 250 },
  { name: "Gongura Boneless Chicken", price: 290, unit: 250 },
  { name: "Gongura Country Chicken", price: 330, unit: 250 },
  { name: "Gongura Small Prawns", price: 370, unit: 250 },
  { name: "Gongura Large Prawns", price: 410, unit: 250 },
  { name: "Gongura Mutton", price: 405, unit: 250 },
  { name: "Gongura Boneless Mutton", price: 455, unit: 250 },
  { name: "Gongura Mutton Kheema", price: 455, unit: 250 },
  { name: "Mutton Boti Pickle", price: 400, unit: 250 },
  { name: "Mutton Boti Gongura Pickle", price: 400, unit: 250 },
  { name: "Small Prawns Extra", price: 445, unit: 250 },
  { name: "Large Prawns Extra", price: 480, unit: 250 },
  { name: "Gongura Small Prawns Extra", price: 445, unit: 250 },
  { name: "Gongura Large Prawns Extra", price: 480, unit: 250 },
];

// --- 2. Veg Pickles (250g) ---------------------------------------------------
const VEG_ITEMS: RawItem[] = [
  {
    name: "Mango Avakaya Pickle",
    price: 130,
    unit: 250,
    bestseller: true,
    originalPrice: 149,
    rating: 4.9,
  },
  { name: "Mango Biryani Pickle", price: 130, unit: 250 },
  { name: "Jaggery Mango Pickle", price: 130, unit: 250 },
  { name: "Ginger Mango Pickle", price: 130, unit: 250 },
  { name: "Small Cut Mango Pickle", price: 130, unit: 250 },
  { name: "Grated Mango Pickle", price: 130, unit: 250 },
  { name: "Amla Pickle", price: 130, unit: 250 },
  { name: "Grated Amla Pickle", price: 130, unit: 250 },
  { name: "Ginger Pickle", price: 130, unit: 250 },
  { name: "Garlic Pickle", price: 130, unit: 250, bestseller: true, rating: 4.7 },
  { name: "Drumstick Pickle", price: 130, unit: 250 },
  { name: "Lemon Pickle", price: 130, unit: 250 },
  { name: "Tomato Pickle", price: 130, unit: 250 },
  { name: "Tomato Red Chilli Pickle", price: 130, unit: 250 },
  { name: "Tamarind Pickle", price: 130, unit: 250 },
  { name: "Raw Tamarind Pickle", price: 130, unit: 250 },
  { name: "Red Chilli Pickle", price: 130, unit: 250 },
  { name: "Green Chilli Pickle", price: 130, unit: 250 },
  { name: "Bitter Gourd Pickle", price: 130, unit: 250 },
  { name: "Citron Pickle", price: 130, unit: 250 },
  { name: "Brinjal Pickle", price: 130, unit: 250 },
  { name: "Gongura Pickle", price: 130, unit: 250, bestseller: true, rating: 4.8 },
  { name: "Coriander Pickle", price: 130, unit: 250 },
  { name: "Curry Leaves Pickle", price: 130, unit: 250 },
  { name: "Mint Leaves Pickle", price: 130, unit: 250 },
  { name: "Mixed Veg Pickle", price: 130, unit: 250 },
  { name: "Mango Ginger Pickle", price: 130, unit: 250 },
  { name: "Raw Banana Pickle", price: 130, unit: 250 },
  { name: "Carrot Pickle", price: 130, unit: 250 },
  { name: "Beetroot Pickle", price: 130, unit: 250 },
  { name: "Raw Tamarind Red Chilli", price: 130, unit: 250 },
  { name: "Drumstick Leaves Pickle", price: 130, unit: 250 },
  { name: "Gongura Red Chilli", price: 130, unit: 250 },
  { name: "Cauliflower Pickle", price: 130, unit: 250 },
  { name: "Veld Grape Pickle", price: 130, unit: 250 },
  { name: "Elephant Foot Yam Pickle", price: 130, unit: 250 },
  { name: "Broad Beans Pickle", price: 135, unit: 250 },
];

// --- 3. Karapodulu (100g) ----------------------------------------------------
const KARAPODI_ITEMS: RawItem[] = [
  { name: "Rice Karappodi", price: 50, unit: 100 },
  { name: "Idly Karappodi", price: 50, unit: 100, bestseller: true, rating: 4.8 },
  { name: "Toor Dal Karappodi", price: 50, unit: 100 },
  { name: "Drumstick Leaves Karappodi", price: 59, unit: 100 },
  { name: "Bitter Gourd Karappodi", price: 50, unit: 100 },
  { name: "Curry Leaves Karappodi", price: 50, unit: 100 },
  { name: "Gongura Leaves Karappodi", price: 47, unit: 100 },
  { name: "Coriander Karappodi", price: 47, unit: 100 },
  { name: "Mint Leaves Karappodi", price: 47, unit: 100 },
  { name: "Groundnut Karappodi", price: 50, unit: 100 },
  { name: "Sesame Karappodi", price: 55, unit: 100 },
  { name: "Garlic Karappodi", price: 50, unit: 100 },
  { name: "Roasted Dal Karappodi", price: 50, unit: 100 },
  { name: "Nallera Karappodi", price: 57, unit: 100 },
  { name: "Flax Seeds Karappodi", price: 62, unit: 100 },
  { name: "Dry Prawns Karappodi", price: 59, unit: 100, isVeg: false },
  { name: "Minapa Karappodi", price: 47, unit: 100 },
  { name: "Kobbari Karappodi", price: 57, unit: 100 },
  { name: "Amla Karappodi", price: 49, unit: 100 },
  { name: "Sonti Karappodi", price: 47, unit: 100 },
  { name: "Nalla Karam Podi", price: 47, unit: 100, bestseller: true, rating: 4.7 },
];

// --- 4. Vadiyalu (100g, Pumpkin at 250g) ------------------------------------
const VADIYALU_ITEMS: RawItem[] = [
  { name: "Rice Vadiyalu", price: 72, unit: 100, bestseller: true, rating: 4.6 },
  { name: "Carrot Vadiyalu", price: 77, unit: 100 },
  { name: "Beetroot Vadiyalu", price: 77, unit: 100 },
  { name: "Tomato Vadiyalu", price: 77, unit: 100 },
  { name: "Ragi Vadiyalu", price: 77, unit: 100 },
  { name: "Drumstick Vadiyalu", price: 77, unit: 100 },
  { name: "Curry Leaves Vadiyalu", price: 77, unit: 100 },
  { name: "Mint Leaves Vadiyalu", price: 77, unit: 100 },
  { name: "Coriander Vadiyalu", price: 77, unit: 100 },
  { name: "Moong Dal Vadiyalu", price: 77, unit: 100 },
  { name: "Urad Dal Vadiyalu", price: 77, unit: 100 },
];
const VADIYALU_ITEMS_250: RawItem[] = [{ name: "Pumpkin Vadiyalu", price: 240, unit: 250 }];

// --- 5. Powders / Cooking Products ------------------------------------------
const COOKING_POWDER_ITEMS_100: RawItem[] = [
  { name: "Challa Mirchi", price: 41, unit: 100 },
  { name: "Rasam Podi", price: 41, unit: 100 },
  { name: "Sambar Podi", price: 41, unit: 100 },
];
const COOKING_POWDER_ITEMS_250: RawItem[] = [
  { name: "Kura Karam", price: 120, unit: 250 },
  { name: "Turmeric Powder", price: 70, unit: 250 },
];

// --- 6. Masalas (100g, Masala Karam at 250g) --------------------------------
const MASALA_ITEMS: RawItem[] = [
  { name: "Chicken Masala", price: 65, unit: 100, bestseller: true, rating: 4.6 },
  { name: "Mutton Masala", price: 70, unit: 100 },
  { name: "Fish Masala", price: 65, unit: 100 },
  { name: "Chicken Kebab Masala", price: 60, unit: 100 },
];
const MASALA_ITEMS_250: RawItem[] = [{ name: "Masala Karam", price: 130, unit: 250 }];

// --- 7. Cooking Pastes (250g, Ulavacharu 500ml) ------------------------------
const PASTE_ITEMS: RawItem[] = [
  { name: "Pulihora Paste", price: 110, unit: 250 },
  { name: "Tomato Paste", price: 90, unit: 250 },
  { name: "Pudhina Paste", price: 90, unit: 250 },
  { name: "Kothimeera Paste", price: 90, unit: 250 },
  { name: "Gongura Paste", price: 100, unit: 250 },
];
const PASTE_ITEMS_500: RawItem[] = [{ name: "Ulavacharu", price: 180, unit: 500 }];

// --- 8. Sweets & Premium Products -------------------------------------------
const PREMIUM_ITEMS: RawItem[] = [
  { name: "Putharekulu", price: 120, unit: 250, bestseller: true, rating: 4.9 },
  { name: "Mamidi Thandra (Sugar)", price: 85, unit: 250 },
  { name: "Bellam Mamidi Thandra", price: 85, unit: 250 },
  { name: "Thati Thandra", price: 105, unit: 250 },
  { name: "Pure Honey", price: 170, unit: 250 },
  { name: "Pure Ghee", price: 270, unit: 250 },
  { name: "Sunnundalu", price: 150, unit: 250 },
  { name: "Kobbari Undalu", price: 130, unit: 250 },
  { name: "Ragi Undalu", price: 130, unit: 250 },
  { name: "Palli Chekkilu", price: 110, unit: 250 },
  { name: "Nuvvula Chekkilu", price: 110, unit: 250 },
];
const PREMIUM_ITEMS_500: RawItem[] = [{ name: "Dry Fruit Laddu", price: 328, unit: 500 }];
const PREMIUM_ITEMS_1000: RawItem[] = [
  { name: "Pure Honey", price: 665, unit: 1000 },
  { name: "Pure Ghee", price: 1075, unit: 1000 },
];
// --- 9. Sweets & Snacks ------------------------------------------------------
const SWEETS_ITEMS: RawItem[] = [
  {
    name: "Ribbon Murukulu",
    price: 76,
    unit: 250,
    bestseller: true,
    originalPrice: 89,
    rating: 4.7,
  },
  { name: "Dootha Pakodi", price: 76, unit: 250 },
  { name: "Atukulu (Poha) Mixture", price: 76, unit: 250 },
  { name: "Lavu Karapusa", price: 76, unit: 250 },
  { name: "Sanna Karapusa", price: 76, unit: 250 },
  { name: "Palli Pakodi", price: 80, unit: 250 },
  { name: "Jantikalu", price: 76, unit: 250 },
  { name: "Baru Murukulu", price: 76, unit: 250 },
  { name: "Round Murukulu", price: 76, unit: 250 },
  { name: "Challa Jantikalu", price: 76, unit: 250 },
  { name: "Cornflakes Mixture", price: 76, unit: 250 },
  { name: "Kara Boondi", price: 76, unit: 250 },
  { name: "All Mixture", price: 76, unit: 250 },
  { name: "Small Chegodilu", price: 76, unit: 250 },
  { name: "Dal Mudi Mixture", price: 80, unit: 250 },
  { name: "Masala Kabuli Chana", price: 96, unit: 250 },
  { name: "Chekkalu", price: 76, unit: 250 },
  { name: "Sanna Boondi Chikki", price: 84, unit: 250 },
  { name: "Sweet Kommulu", price: 76, unit: 250 },
  { name: "Gavvalu", price: 76, unit: 250 },
  { name: "Gorumitlu (Sugar)", price: 76, unit: 250 },
  { name: "Gorumitlu (Jaggery)", price: 80, unit: 250 },
  { name: "Sweet Boondi", price: 76, unit: 250 },
  { name: "Nuvvula Chikki", price: 92, unit: 250 },
  { name: "Palli Chikki", price: 88, unit: 250 },
  { name: "Venna Golilu", price: 116, unit: 250 },
];
const SWEETS_ITEMS_500: RawItem[] = [
  { name: "Ariselu", price: 243, unit: 500, bestseller: true, rating: 4.8 },
  { name: "Nuvvula Ariselu", price: 268, unit: 500 },
  { name: "Ragi Dal Laddu", price: 325, unit: 500 },
  { name: "Coconut Laddu", price: 275, unit: 500 },
  { name: "Ragi Laddu", price: 325, unit: 500 },
];

// --- 10. Bakery & Dry Fruits --------------------------------------------------
const PASTRY_CAKE_ITEM: RawItem[] = [
  { name: "Pastry Cake - Vanilla", price: 500, unit: 500 },
  { name: "Pastry Cake - Chocolate", price: 500, unit: 500 },
  { name: "Pastry Cake - Butterscotch", price: 500, unit: 500 },
];
const DRY_FRUITS_ITEM: RawItem[] = [{ name: "Dry Fruits", price: 300, unit: 250 }];

// ---------------------------------------------------------------------------
// 11. Premium Spices Wholesale — 500g / 1kg pricing given directly (no
// bulk-discount curve; wholesale rates are already close to linear).
// Business contact for WhatsApp + Call, used across the whole Premium
// Spices section:
// ---------------------------------------------------------------------------
export const PREMIUM_SPICES_CONTACT = "+91 77997 32444";
export const PREMIUM_SPICES_WHATSAPP_NUMBER = "917799732444"; // wa.me format, no + or spaces

type SpiceItem = {
  name: string;
  nameTelugu: string;
  subCategory: (typeof PREMIUM_SPICES_SUBCATEGORIES)[number];
  price1kg: number; // ₹ per kg (wholesale)
  price500g: number; // ₹ per 500g (wholesale)
  bestseller?: boolean;
};

// Prices entered exactly as quoted. Where the price sheet gave a range
// (e.g. "₹920–960/kg"), the midpoint is used — edit price1kg / price500g
// on any line below to update it later.
const SPICE_ITEMS: SpiceItem[] = [
  { name: "Elaichi 7mm", nameTelugu: "యలకులు", subCategory: "Premium Whole Spices", price1kg: 3800, price500g: 1900, bestseller: true },
  { name: "Elaichi 7.5mm", nameTelugu: "యలకులు", subCategory: "Premium Whole Spices", price1kg: 4200, price500g: 2100 },
  { name: "Elaichi 8+mm", nameTelugu: "యలకులు", subCategory: "Premium Whole Spices", price1kg: 4400, price500g: 2200, bestseller: true },
  { name: "Cloves", nameTelugu: "లవంగాలు", subCategory: "Premium Whole Spices", price1kg: 940, price500g: 470 },
  { name: "Black Pepper Kerala", nameTelugu: "మిరియాలు", subCategory: "Premium Whole Spices", price1kg: 920, price500g: 460, bestseller: true },
  { name: "White Pepper", nameTelugu: "తెల్ల మిరియాలు", subCategory: "Premium Whole Spices", price1kg: 1350, price500g: 675 },
  { name: "Jeera Premium", nameTelugu: "జీలకర్ర Premium", subCategory: "Premium Whole Spices", price1kg: 320, price500g: 160 },

  { name: "Star Anise", nameTelugu: "అనాసపువ్వు", subCategory: "Biryani Spices", price1kg: 605, price500g: 303 },
  { name: "Dalchini Chekka", nameTelugu: "దాల్చిన చెక్క", subCategory: "Biryani Spices", price1kg: 340, price500g: 170 },
  { name: "Roll Dalchini", nameTelugu: "రోల్ దాల్చిన చెక్క", subCategory: "Biryani Spices", price1kg: 560, price500g: 280 },
  { name: "Jajikaya", nameTelugu: "జాయికాయ", subCategory: "Biryani Spices", price1kg: 920, price500g: 460 },
  { name: "Japatiri", nameTelugu: "జాతిపత్రి", subCategory: "Biryani Spices", price1kg: 2550, price500g: 1275 },
  { name: "Marathi Moggu", nameTelugu: "మరటి మొగ్గు", subCategory: "Biryani Spices", price1kg: 330, price500g: 165 },
  { name: "Black Elaichi", nameTelugu: "పెద్ద యలకులు", subCategory: "Biryani Spices", price1kg: 2100, price500g: 1050 },
  { name: "Stone Flower", nameTelugu: "రాతిపువ్వు", subCategory: "Biryani Spices", price1kg: 600, price500g: 300 },
  { name: "Sha Jeera", nameTelugu: "శహ జీరా", subCategory: "Biryani Spices", price1kg: 335, price500g: 168 },
  { name: "Bay Leaf", nameTelugu: "తేజ పత్రి", subCategory: "Biryani Spices", price1kg: 220, price500g: 110 },

  { name: "Kasturi Methi", nameTelugu: "కస్తూరి మెంతి", subCategory: "Herbs & Special Ingredients", price1kg: 370, price500g: 185 },
  { name: "Dry Ginger", nameTelugu: "పొడి అల్లం", subCategory: "Herbs & Special Ingredients", price1kg: 380, price500g: 190 },
  { name: "Daniyalu", nameTelugu: "ధనియాలు", subCategory: "Herbs & Special Ingredients", price1kg: 200, price500g: 100 },
  { name: "Fennel Seeds", nameTelugu: "సోపు గింజలు", subCategory: "Herbs & Special Ingredients", price1kg: 200, price500g: 100 },
  { name: "Sweet Sounf", nameTelugu: "తీపి సోపు గింజలు", subCategory: "Herbs & Special Ingredients", price1kg: 100, price500g: 50 },
  { name: "Rose Petals", nameTelugu: "గులాబీ రేకులు", subCategory: "Herbs & Special Ingredients", price1kg: 780, price500g: 390 },

  { name: "Poppy Seeds", nameTelugu: "గసగసాలు", subCategory: "Dry Fruits & Seeds", price1kg: 1700, price500g: 850 },
  { name: "Watermelon Seeds Small", nameTelugu: "దోస పప్పు చిన్న", subCategory: "Dry Fruits & Seeds", price1kg: 420, price500g: 210 },
  { name: "Watermelon Seeds Big", nameTelugu: "దోస పప్పు పెద్ద", subCategory: "Dry Fruits & Seeds", price1kg: 700, price500g: 350 },
  { name: "Cashew JH", nameTelugu: "జీడిపప్పు JH", subCategory: "Dry Fruits & Seeds", price1kg: 760, price500g: 380 },
  { name: "Cashew Whole", nameTelugu: "జీడిపప్పు హోల్", subCategory: "Dry Fruits & Seeds", price1kg: 800, price500g: 400, bestseller: true },

  { name: "Dhania Powder", nameTelugu: "ధనియాల పొడి", subCategory: "Spice Powders", price1kg: 195, price500g: 98 },
  { name: "Zeera Powder", nameTelugu: "జీలకర్ర పొడి", subCategory: "Spice Powders", price1kg: 400, price500g: 200 },
  { name: "Garam Masala", nameTelugu: "గరం మసాలా", subCategory: "Spice Powders", price1kg: 750, price500g: 375, bestseller: true },
  { name: "Chicken Masala", nameTelugu: "చికెన్ మసాలా", subCategory: "Spice Powders", price1kg: 750, price500g: 375 },
  { name: "Biryani Masala", nameTelugu: "బిర్యానీ మసాలా", subCategory: "Spice Powders", price1kg: 750, price500g: 375, bestseller: true },
  { name: "Coconut Powder", nameTelugu: "కొబ్బరి పొడి", subCategory: "Spice Powders", price1kg: 300, price500g: 150 },
  { name: "Sambar Powder", nameTelugu: "సాంబార్ పొడి", subCategory: "Spice Powders", price1kg: 200, price500g: 100 },
];

const SPICE_SUBCATEGORY_BLURB: Record<(typeof PREMIUM_SPICES_SUBCATEGORIES)[number], string> = {
  "Premium Whole Spices": "hand-sorted for size and aroma, straight from the source",
  "Biryani Spices": "the essential whole spice for authentic dum biryani and rich curries",
  "Spice Powders": "stone-ground fresh for deep, consistent flavour",
  "Dry Fruits & Seeds": "cleaned, graded and packed for freshness",
  "Herbs & Special Ingredients": "aromatic, freshly packed specialty ingredient",
};

function buildSpiceProducts(items: SpiceItem[]): Product[] {
  const idPrefix = "sp";
  const category = "premium-spices";
  const categoryMeta = categoriesBase.find((c) => c.slug === category);
  const categoryName = categoryMeta?.name ?? "";
  const categoryImage = categoryMeta?.image ?? "";
  return items.map((it) => {
    const id = `${idPrefix}-${slugify(it.name)}`;
    const variants: WeightVariant[] = [
      { label: gramsLabel(500), price: it.price500g },
      { label: gramsLabel(1000), price: it.price1kg },
    ];
    const description = `${it.name}, ${SPICE_SUBCATEGORY_BLURB[it.subCategory]}. Sold at wholesale rates — order by 500g or 1kg.`;
    const autoFileName = `${toPascalFileName(it.name)}.webp`;
    const productImage = productImageUrl(autoFileName) ?? categoryImage;
    return {
      id,
      slug: id,
      name: it.name,
      nameTelugu: it.nameTelugu,
      category,
      subCategory: it.subCategory,
      isVeg: true,
      description,
      shortDescription: description.split(". ")[0]!.replace(/\.$/, "") + ".",
      ingredients: `100% ${it.name}, no additives.`,
      price: variants[0]!.price,
      variants,
      image: productImage,
      gallery: [productImage, productImage, productImage],
      inStock: true,
      bestseller: it.bestseller ?? false,
      featured: it.bestseller ?? false,
      rating: it.bestseller ? 4.8 : ratingFor(id),
      reviewCount: reviewCountFor(id),
      tags: [category, categoryName, it.subCategory, "veg", "wholesale", ...(it.bestseller ? ["bestseller"] : [])],
    };
  });
}

export const products: Product[] = [
  ...buildBlock("non-veg-pickles", "nv", "standard", false, "non-veg", NON_VEG_ITEMS),
  ...buildBlock("veg-pickles", "vp", "standard", true, "veg", VEG_ITEMS),
  ...buildBlock("karapodulu", "kp", "podi", true, "karapodulu", KARAPODI_ITEMS),
  ...buildBlock("vadiyalu", "vd", "podi", true, "vadiyalu", VADIYALU_ITEMS),
  ...buildBlock("vadiyalu", "vd", "standard", true, "vadiyalu", VADIYALU_ITEMS_250),
  ...buildBlock("cooking-powders", "cw", "podi", true, "cooking-powders", COOKING_POWDER_ITEMS_100),
  ...buildBlock(
    "cooking-powders",
    "cw",
    "standard",
    true,
    "cooking-powders",
    COOKING_POWDER_ITEMS_250,
  ),
  ...buildBlock("masalas", "ms", "podi", true, "masalas", MASALA_ITEMS),
  ...buildBlock("masalas", "ms", "standard", true, "masalas", MASALA_ITEMS_250),
  ...buildBlock("cooking-pastes", "pa", "standard", true, "cooking-pastes", PASTE_ITEMS),
  ...buildBlock("cooking-pastes", "pa", "cake", true, "cooking-pastes", PASTE_ITEMS_500),
  ...buildBlock("premium-sweets", "pr", "standard", true, "premium-sweets", PREMIUM_ITEMS),
  ...buildBlock("premium-sweets", "pr", "cake", true, "premium-sweets", PREMIUM_ITEMS_500),
  ...buildBlock("premium-sweets", "pr", "large", true, "premium-sweets", PREMIUM_ITEMS_1000),
  ...buildBlock("sweets-snacks", "ss", "standard", true, "sweets-snacks", SWEETS_ITEMS),
  ...buildBlock("sweets-snacks", "ss", "cake", true, "sweets-snacks", SWEETS_ITEMS_500),
  ...buildBlock("bakery-dry-fruits", "bk", "cake", true, "bakery", PASTRY_CAKE_ITEM),
  ...buildBlock("bakery-dry-fruits", "bk", "standard", true, "bakery", DRY_FRUITS_ITEM),
  ...buildSpiceProducts(SPICE_ITEMS),
];

export const categories: Category[] = categoriesBase.map((c) => ({
  ...c,
  count: products.filter((p) => p.category === c.slug).length,
}));

export const getProduct = (id: string) => products.find((p) => p.id === id);
export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
export const productsByCategory = (slug: string) => products.filter((p) => p.category === slug);
// For the Premium Spices tabs — e.g. productsBySubCategory("premium-spices", "Biryani Spices")
export const productsBySubCategory = (slug: string, subCategory: string) =>
  products.filter((p) => p.category === slug && p.subCategory === subCategory);
export const bestsellers = products.filter((p) => p.bestseller);
export const minPrice = Math.min(...products.map((p) => p.price));
export const maxPrice = Math.max(...products.map((p) => p.price));
export const allWeights = Array.from(
  new Set(products.flatMap((p) => p.variants.map((v2) => v2.label))),
);

export const searchProducts = (q: string) => {
  const term = q.trim().toLowerCase();
  if (!term) return [];
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(term) ||
      p.nameTelugu.includes(term) ||
      p.description.toLowerCase().includes(term) ||
      p.tags.some((t) => t.toLowerCase().includes(term)),
  );
};

export const formatINR = (n: number) => `₹${n.toLocaleString("en-IN")}`;

// Build a wa.me deep link with a pre-filled message for a given product +
// weight, so the WhatsApp Order button on each Premium Spices card can just
// do: window.open(whatsAppOrderLink(product, variant), "_blank")
export const whatsAppOrderLink = (productName: string, variantLabel: string, price: number) => {
  const message = `Hi, I'd like to order ${productName} (${variantLabel}) - ${formatINR(price)}. Please confirm availability.`;
  return `https://wa.me/${PREMIUM_SPICES_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};

export const callNowLink = () => `tel:${PREMIUM_SPICES_CONTACT.replace(/\s+/g, "")}`;