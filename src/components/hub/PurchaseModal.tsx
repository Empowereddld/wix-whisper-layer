import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Lock } from "lucide-react";
import type { Resource } from "@/hooks/useResources";
import type { Product } from "@/hooks/usePurchases";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PurchaseModalProps {
  resource: Resource | null;
  product: Product | null;
  open: boolean;
  onClose: () => void;
  onPurchased: () => void;
  userId?: string;
}

const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;

const PurchaseModal = ({ resource, product, open, onClose, onPurchased, userId }: PurchaseModalProps) => {
  const [purchasing, setPurchasing] = useState(false);

  if (!resource || !product) return null;

  const handlePurchase = async () => {
    if (!userId) return;
    setPurchasing(true);

    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { resource_id: resource.id },
      });

      if (error || !data?.url) {
        const msg = data?.error || "Unable to start checkout. Please try again.";
        if (msg === "Already purchased") {
          toast.info("You already own this resource!");
          onPurchased();
          onClose();
        } else {
          toast.error(msg);
        }
        setPurchasing(false);
        return;
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch {
      toast.error("Checkout failed. Please try again.");
      setPurchasing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-midnight text-xl">Unlock Resource</DialogTitle>
          <DialogDescription className="text-stone-ui">
            One-time purchase — permanent access
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          {/* Resource preview */}
          <div className="flex items-start gap-4 p-4 rounded-xl bg-thistle/20">
            <div className="h-14 w-14 rounded-lg bg-thistle/50 flex items-center justify-center flex-shrink-0">
              <Lock className="h-6 w-6 text-hub-lavender" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-midnight text-sm leading-snug">{resource.title}</h3>
              <p className="text-xs text-stone-ui line-clamp-2 mt-1">{resource.description}</p>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center justify-center gap-4 p-4 rounded-xl bg-midnight/5">
            <span className="text-sm font-medium text-midnight">Total</span>
            <span className="text-2xl font-bold text-midnight">
              {formatPrice(product.price)}
            </span>
          </div>

          {/* Actions */}
          <Button
            className="w-full h-12 bg-pale-yellow text-midnight hover:bg-pale-yellow/90 font-semibold text-base"
            onClick={handlePurchase}
            disabled={purchasing}
          >
            {purchasing ? "Redirecting to checkout…" : `Purchase for ${formatPrice(product.price)} →`}
          </Button>

          <div className="flex items-center justify-center gap-2 text-xs text-stone-ui">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Secure Stripe checkout · Instant access · Empowered DLD</span>
          </div>

          <button onClick={onClose} className="w-full text-center text-sm text-stone-ui hover:text-midnight transition-colors">
            Cancel
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseModal;
