import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

/**
 * Branded handoff page for Story Pros email verification.
 *
 * Why this exists:
 * - Email clients (Gmail, Outlook Safe Links, corporate scanners) often
 *   pre-fetch or rewrite raw Supabase function URLs, which previously made
 *   users see scanner interstitials or blank pages.
 * - This page reads the token from the URL, shows a branded loading state,
 *   then navigates the browser to the existing verify edge function, which
 *   issues a 302 to /storypros/verified (success) or returns the branded
 *   error HTML page.
 *
 * No fetch / CORS dependency — it's a top-level navigation, identical
 * semantics to the old direct link but presented through our domain.
 */
export default function VerifyEmailHandoff() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError("This verification link is missing its token. Please use the link from your most recent Story Pros email.");
      return;
    }
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    if (!supabaseUrl) {
      setError("We hit a configuration issue verifying your email. Please try again in a moment.");
      return;
    }
    const target = `${supabaseUrl}/functions/v1/verify-email-waitlist?token=${encodeURIComponent(token)}`;
    // Small delay so the branded card is visible even on fast networks.
    const t = window.setTimeout(() => {
      window.location.assign(target);
    }, 250);
    return () => window.clearTimeout(t);
  }, [token]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#5B2D8E] to-[#7C3FB8] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-br from-[#5B2D8E] to-[#7C3FB8] text-white px-6 py-8 text-center">
          <h1 className="text-2xl font-bold">Story Pros</h1>
          <p className="opacity-90 mt-1">Verifying your email</p>
        </div>
        <div className="p-8 text-center text-gray-700">
          {error ? (
            <>
              <p className="mb-4">{error}</p>
              <Link
                to="/storypros"
                className="inline-block bg-[#5B2D8E] hover:bg-[#4A2370] text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                Back to Story Pros
              </Link>
            </>
          ) : (
            <>
              <div className="mx-auto mb-4 h-10 w-10 rounded-full border-4 border-[#5B2D8E]/20 border-t-[#5B2D8E] animate-spin" />
              <p className="font-medium">Confirming your spot on the waitlist...</p>
              <p className="text-sm text-gray-500 mt-2">
                You'll be redirected automatically. If nothing happens after a few seconds, refresh this page.
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
