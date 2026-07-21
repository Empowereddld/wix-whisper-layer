import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type CountryCode = "CA" | "US" | "GB" | "IE" | "AU" | "NZ";

export interface CountryOption {
  code: CountryCode;
  label: string;
  currency: string;
}

export const COUNTRY_OPTIONS: CountryOption[] = [
  { code: "CA", label: "Canada", currency: "CAD" },
  { code: "US", label: "United States", currency: "USD" },
  { code: "GB", label: "United Kingdom", currency: "GBP" },
  { code: "IE", label: "European Union", currency: "EUR" },
  { code: "AU", label: "Australia", currency: "AUD" },
  { code: "NZ", label: "New Zealand", currency: "NZD" },
];

interface RegionStore {
  countryCode: CountryCode;
  setCountry: (code: CountryCode) => void;
}

export const useRegionStore = create<RegionStore>()(
  persist(
    (set, get) => ({
      countryCode: "CA",
      setCountry: (code) => {
        if (code === get().countryCode) return;
        set({ countryCode: code });
        // Clear the merch cart when currency changes — Shopify carts are locked
        // to a single currency, so we start fresh in the new region.
        // Lazy import to avoid circular dependency at module load.
        import("./merchCartStore").then(({ useMerchCartStore }) => {
          const { items, clearCart } = useMerchCartStore.getState();
          if (items.length > 0) clearCart();
        });
      },
    }),

    {
      name: "empowered-region",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export function getCountryOption(code: CountryCode): CountryOption {
  return COUNTRY_OPTIONS.find((c) => c.code === code) ?? COUNTRY_OPTIONS[0];
}
