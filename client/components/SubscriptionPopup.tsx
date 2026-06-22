import { useState } from "react";
import { Loader2, Phone } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { COUNTRY_CODE, useSubscription } from "@/context/SubscriptionContext";
import { checkSubscriptionStatus, redirectToCampaign } from "@/lib/subscription-api";
import { isSubscribed } from "@shared/subscription";

export function SubscriptionPopup() {
  const {
    isMobilePopupOpen,
    closeMobilePopup,
    setMsisdn,
    productcode,
    pendingVideoCallback,
    setPendingVideoCallback,
    checkAccess,
  } = useSubscription();

  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const digits = phone.replace(/\D/g, "");
    if (digits.length < 8) {
      setError("Veuillez entrer un numéro de mobile valide.");
      return;
    }

    const fullMsisdn = `225${digits}`;
    setMsisdn(fullMsisdn);
    setLoading(true);

    try {
      const result = await checkSubscriptionStatus("0", productcode, fullMsisdn);
      const active = isSubscribed(result);

      if (active) {
        await checkAccess();
        closeMobilePopup();
        setPhone("");
        pendingVideoCallback?.();
        setPendingVideoCallback(null);
      } else {
        closeMobilePopup();
        setPhone("");
        setPendingVideoCallback(null);
        redirectToCampaign("0", productcode);
      }
    } catch {
      setError("Impossible de vérifier l'abonnement. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      closeMobilePopup();
      setPendingVideoCallback(null);
      setError("");
    }
  };

  return (
    <Dialog open={isMobilePopupOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md bg-zinc-950 border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <Phone className="w-5 h-5 text-red-500" />
            Entrez votre numéro mobile
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Saisissez votre numéro pour accéder aux vidéos. L'abonnement est requis pour regarder le contenu.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <div className="flex items-center px-3 h-10 rounded-md border border-white/20 bg-white/5 text-gray-300 text-sm font-medium shrink-0">
              {COUNTRY_CODE}
            </div>
            <Input
              type="tel"
              inputMode="numeric"
              placeholder="05 XX XX XX XX"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/[^\d\s]/g, ""))}
              className="bg-white/5 border-white/20 text-white placeholder:text-gray-500"
              autoFocus
              disabled={loading}
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={loading}
              className="border-white/20 text-white hover:bg-white/10"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Vérification...
                </>
              ) : (
                "Continuer"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
