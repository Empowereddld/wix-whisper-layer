import { ShoppingBag } from "lucide-react";
import { useMerchCartStore } from "@/stores/merchCartStore";

const MerchCartButton = () => {
  const itemCount = useMerchCartStore((state) => state.getItemCount());
  const openCart = useMerchCartStore((state) => state.openCart);

  return (
    <button
      onClick={openCart}
      className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-deep-purple text-white shadow-xl hover:bg-deep-purple/90 transition-colors flex items-center justify-center"
      aria-label={`Open cart, ${itemCount} items`}
    >
      <ShoppingBag className="h-5 w-5" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-pale-yellow text-deep-purple text-[11px] font-bold flex items-center justify-center border-2 border-background">
          {itemCount}
        </span>
      )}
    </button>
  );
};

export default MerchCartButton;
