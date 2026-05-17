import { useEffect, useState } from "react";
import NoIndexHead from "@/components/NoIndexHead";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [resourceId, setResourceId] = useState<string | null>(null);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (!sessionId) {
      setStatus("error");
      return;
    }

    const verify = async () => {
      try {
        const { data, error } = await supabase.functions.invoke("verify-payment", {
          body: { session_id: sessionId },
        });

        if (error || !data?.success) {
          console.error("Verification failed:", data?.error || error);
          setStatus("error");
          return;
        }

        setResourceId(data.resource_id);
        setStatus("success");
      } catch {
        setStatus("error");
      }
    };

    verify();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <NoIndexHead />
      <div className="max-w-md w-full text-center space-y-6">
        {status === "verifying" && (
          <>
            <Loader2 className="h-16 w-16 text-primary animate-spin mx-auto" />
            <h1 className="text-2xl font-bold text-midnight">Verifying your payment…</h1>
            <p className="text-stone-ui">This will only take a moment.</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto" />
            <h1 className="text-2xl font-bold text-midnight">Payment Successful!</h1>
            <p className="text-stone-ui">
              Your resource has been unlocked. You can now download it anytime from the Resource Library.
            </p>
            <div className="flex flex-col gap-3 pt-4">
              {resourceId && (
                <Button onClick={() => navigate(`/hub/resource/${resourceId}`)} className="bg-pale-yellow text-midnight hover:bg-pale-yellow/90 font-semibold">
                  View Resource →
                </Button>
              )}
              <Button variant="outline" onClick={() => navigate("/hub")}>
                Back to Resource Library
              </Button>
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="h-16 w-16 text-destructive mx-auto" />
            <h1 className="text-2xl font-bold text-midnight">Something went wrong</h1>
            <p className="text-stone-ui">
              We couldn't verify your payment. If you were charged, your purchase will be recorded shortly. Please contact support if the issue persists.
            </p>
            <Button variant="outline" onClick={() => navigate("/hub")}>
              Back to Resource Library
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
