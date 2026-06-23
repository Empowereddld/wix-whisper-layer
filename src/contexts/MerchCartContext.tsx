import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";

export interface MerchCartItem {
  productHandle: string;
  title: string;
  variantId: string;
  variantLabel: string;
  price: number; // cents
  image: string;
  quantity: number;
}

interface MerchCartContextValue {
  items: MerchCartItem[];
  itemCount: number;
  subtotal: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<MerchCartItem, "quantity">, qty?: number) => void;
  updateQty: (productHandle: string, variantId: string, qty: number) => void;
  removeItem: (productHandle: string, variantId: string) => void;
  clear: () => void;
}

const MerchCartContext = createContext<MerchCartContextValue | undefined>(undefined);

const STORAGE_KEY = "edld_merch_cart_v1";

const keyOf = (h: string, v: string) => `${h}::${v}`;

export const MerchCartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<MerchCartItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as MerchCartItem[]) : [];
    } catch {
      return [];
    }
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  const addItem: MerchCartContextValue["addItem"] = useCallback((item, qty = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex(
        (i) => keyOf(i.productHandle, i.variantId) === keyOf(item.productHandle, item.variantId)
      );
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + qty };
        return next;
      }
      return [...prev, { ...item, quantity: qty }];
    });
  }, []);

  const updateQty: MerchCartContextValue["updateQty"] = useCallback((h, v, qty) => {
    setItems((prev) =>
      prev
        .map((i) => (keyOf(i.productHandle, i.variantId) === keyOf(h, v) ? { ...i, quantity: qty } : i))
        .filter((i) => i.quantity > 0)
    );
  }, []);

  const removeItem: MerchCartContextValue["removeItem"] = useCallback((h, v) => {
    setItems((prev) => prev.filter((i) => keyOf(i.productHandle, i.variantId) !== keyOf(h, v)));
  }, []);

  const value = useMemo<MerchCartContextValue>(() => {
    const itemCount = items.reduce((n, i) => n + i.quantity, 0);
    const subtotal = items.reduce((n, i) => n + i.quantity * i.price, 0);
    return {
      items,
      itemCount,
      subtotal,
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addItem,
      updateQty,
      removeItem,
      clear: () => setItems([]),
    };
  }, [items, isOpen, addItem, updateQty, removeItem]);

  return <MerchCartContext.Provider value={value}>{children}</MerchCartContext.Provider>;
};

export const useMerchCart = () => {
  const ctx = useContext(MerchCartContext);
  if (!ctx) throw new Error("useMerchCart must be used within MerchCartProvider");
  return ctx;
};
