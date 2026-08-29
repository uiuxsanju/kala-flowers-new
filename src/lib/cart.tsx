import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { formatINR } from "@/data/products";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export type CartItem = {
  key: string;
  id: string;
  name: string;
  category: string;
  isVeg: boolean;
  weight: string;
  price: number;
  qty: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  hydrated: boolean;
  open: boolean;
  setOpen: (v: boolean) => void;
  addItem: (item: Omit<CartItem, "key">) => void;
  setQty: (key: string, qty: number) => void;
  removeItem: (key: string) => void;
  clear: () => void;
  whatsappUrl: string;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "kala-flavours-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as CartItem[]);
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items, hydrated]);

  const addItem = useCallback((item: Omit<CartItem, "key">) => {
    const key = `${item.id}__${item.weight}`;
    setItems((prev) => {
      const found = prev.find((i) => i.key === key);
      if (found) {
        return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + item.qty } : i));
      }
      return [...prev, { ...item, key }];
    });
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => i.key !== key)
        : prev.map((i) => (i.key === key ? { ...i, qty } : i)),
    );
  }, []);

  const removeItem = useCallback((key: string) => {
    setItems((prev) => prev.filter((i) => i.key !== key));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const subtotal = useMemo(() => items.reduce((s, i) => s + i.price * i.qty, 0), [items]);
  const count = useMemo(() => items.reduce((s, i) => s + i.qty, 0), [items]);

  const whatsappUrl = useMemo(() => {
    const lines = [
      "*Kala Flavours — New Order*",
      "",
      ...items.map(
        (i, idx) =>
          `${idx + 1}. ${i.name} (${i.weight}) x ${i.qty} — ${formatINR(i.price * i.qty)}`,
      ),
      "",
      `Subtotal: ${formatINR(subtotal)}`,
      "Delivery: to be confirmed",
      `*Total: ${formatINR(subtotal)}*`,
      "",
      "Name:",
      "Delivery address:",
    ];
    return buildWhatsAppUrl(lines.join("\n"));
  }, [items, subtotal]);

  const value: CartContextValue = {
    items,
    count,
    subtotal,
    hydrated,
    open,
    setOpen,
    addItem,
    setQty,
    removeItem,
    clear,
    whatsappUrl,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
