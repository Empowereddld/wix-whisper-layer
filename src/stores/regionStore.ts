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
  hasUserChosen: boolean;
  setCountry: (code: CountryCode) => void;
  detectAndSetCountry: (code: CountryCode) => void;
}

export const useRegionStore = create<RegionStore>()(
  persist(
    (set, get) => ({
      countryCode: "US",
      hasUserChosen: false,
      setCountry: (code) => {
        const prev = get().countryCode;
        set({ countryCode: code, hasUserChosen: true });
        if (code === prev) return;
        // Clear the merch cart when currency changes — Shopify carts are locked
        // to a single currency, so we start fresh in the new region.
        // Lazy import to avoid circular dependency at module load.
        import("./merchCartStore").then(({ useMerchCartStore }) => {
          const { items, clearCart } = useMerchCartStore.getState();
          if (items.length > 0) clearCart();
        });
      },
      detectAndSetCountry: (code) => {
        if (get().hasUserChosen) return;
        if (code === get().countryCode) return;
        set({ countryCode: code });
      },
    }),
    {
      name: "empowered-region",
      storage: createJSONStorage(() => localStorage),
      // Migrate existing users: if they have a persisted countryCode from before
      // this feature, treat it as an explicit choice so detection doesn't override it.
      onRehydrateStorage: () => (state) => {
        if (state && state.hasUserChosen === undefined) {
          state.hasUserChosen = true;
        }
      },
    }
  )
);

export function getCountryOption(code: CountryCode): CountryOption {
  return COUNTRY_OPTIONS.find((c) => c.code === code) ?? COUNTRY_OPTIONS[0];
}

