import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useMerchCart } from "@/contexts/MerchCartContext";
import { formatMerchPrice } from "@/data/merchPlaceholders";
import { toast } from "sonner";

const MerchCartDrawer = () => {
  const { items, isOpen, closeCart, updateQty, removeItem, subtotal } = useMerchCart();

  const handleCheckout = () => {
    toast.info("Checkout will hand off to Shopify once products are connected.", {
      description: "Right now this is a preview. Real checkout goes live when Phase 3 is wired.",
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={(o) => !o && closeCart()}>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-border/50">
          <SheetTitle className="flex items-center gap-2 text-foreground">
            <ShoppingBag className="h-5 w-5" />
            Your Cart
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
            <ShoppingBag className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-[15px] font-semibold text-foreground mb-1">Your cart is empty</p>
            <p className="text-[13px] text-muted-foreground">Add a tee, mug, or tote to get started.</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.productHandle}-${item.variantId}`}
                  className="flex gap-3 p-3 rounded-lg bg-muted/50"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-20 w-20 rounded-md object-cover flex-shrink-0 bg-white"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-foreground leading-tight">{item.title}</p>
                    <p className="text-[12px] text-muted-foreground mt-0.5">{item.variantLabel}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1.5 bg-background rounded-md border border-border">
                        <button
                          onClick={() => updateQty(item.productHandle, item.variantId, item.quantity - 1)}
                          className="h-7 w-7 flex items-center justify-center text-muted-foreground hover:text-foreground"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-[13px] font-semibold w-5 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQty(item.productHandle, item.variantId, item.quantity + 1)}
                          className="h-7 w-7 flex items-center justify-center text-muted-foreground hover:text-foreground"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <p className="text-[14px] font-bold text-foreground">
                        {formatMerchPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.productHandle, item.variantId)}
                    className="text-muted-foreground hover:text-destructive self-start"
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t border-border/50 px-6 py-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[14px] text-muted-foreground">Subtotal</span>
                <span className="text-[18px] font-bold text-foreground">{formatMerchPrice(subtotal)}</span>
              </div>
              <p className="text-[11px] text-muted-foreground">Shipping and taxes calculated at checkout.</p>
              <Button
                onClick={handleCheckout}
                className="w-full h-12 bg-deep-purple text-white hover:bg-deep-purple/90 font-semibold text-[14px]"
              >
                Checkout
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default MerchCartDrawer;
