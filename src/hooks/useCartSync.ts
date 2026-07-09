import { useEffect } from "react";
import { useMerchCartStore } from "@/stores/merchCartStore";

export function useCartSync() {
  const syncCart = useMerchCartStore((state) => state.syncCart);

  useEffect(() => {
    syncCart();
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") syncCart();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [syncCart]);
}
