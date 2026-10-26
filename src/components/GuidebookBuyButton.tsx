import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { trackGuidebookCheckout } from "@/lib/guidebookAnalytics";
import { Button } from "@/components/ui/button";

const RESOURCE_ID = "1d54403b-1185-46dd-8307-b918a731e580";

const GuidebookBuyButton = ({ className = "", hero = false }: { className?: string; hero?: boolean }) => {
  const [loading, setLoading] = useState(false);

  const startCheckout = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { resource_id: RESOURCE_ID },
      });
      if (error || !data?.url) {
        throw new Error(data?.error || "Checkout failed");
      }
      trackGuidebookCheckout(() => { window.location.href = data.url; });
    } catch {
      toast.error("Checkout could not be started. Please try again in a moment.");
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      onClick={startCheckout}
      disabled={loading}
      className={`h-auto min-h-[52px] px-5 sm:px-8 py-3 whitespace-normal disabled:opacity-60 ${hero
        ? "bg-foreground text-background text-[11px] md:text-[12px] lg:text-[13px] font-bold uppercase tracking-normal rounded-sm hover:bg-foreground/85"
        : "bg-deep-purple text-deep-purple-foreground text-[16px] font-semibold rounded-md hover:bg-deep-purple/90"} ${className}`}
    >
      {loading ? "Redirecting to checkout…" : hero ? "GET THE PARENT GUIDEBOOK - $9.99 USD" : "Get the Parent Guidebook · $9.99 USD"}
    </Button>
  );
};

export default GuidebookBuyButton;