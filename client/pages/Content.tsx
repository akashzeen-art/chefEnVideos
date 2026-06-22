import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useSubscription } from "@/context/SubscriptionContext";
import { checkSubscriptionStatus, redirectToCampaign } from "@/lib/subscription-api";
import { isSubscribed } from "@shared/subscription";

/**
 * Portal content page — mirrors:
 * http://portal.com/content/url?subid={subid}&productcode={productcode}
 *
 * Status check API is called on every content page load.
 * status=1 → allow access (redirect to home/videos)
 * status=0 → redirect to campaign URL
 */
export default function Content() {
  const { subid, productcode } = useSubscription();
  const navigate = useNavigate();
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const result = await checkSubscriptionStatus(subid, productcode);
        if (cancelled) return;

        if (isSubscribed(result)) {
          navigate("/", { replace: true });
        } else {
          redirectToCampaign(subid, productcode);
        }
      } catch {
        if (!cancelled) {
          setError(true);
          redirectToCampaign(subid, productcode);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [subid, productcode, navigate]);

  if (error) return null;

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-10 h-10 animate-spin text-red-500" />
      <p className="text-gray-400 text-sm">Vérification de l'abonnement...</p>
    </div>
  );
}
