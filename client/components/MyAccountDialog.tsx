import { useState } from "react";
import { Loader2, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/context/SubscriptionContext";
import { isSubscribed } from "@shared/subscription";

export function MyAccountDialog() {
  const {
    isMyAccountOpen,
    closeMyAccount,
    accountDetail,
    isAccountLoading,
    handleSubscribe,
    handleUnsubscribe,
    subid,
  } = useSubscription();

  const subscribed = isSubscribed(accountDetail);
  const [unsubLoading, setUnsubLoading] = useState(false);

  async function onUnsubscribe() {
    setUnsubLoading(true);
    try {
      await handleUnsubscribe();
    } finally {
      setUnsubLoading(false);
    }
  }

  return (
    <Dialog open={isMyAccountOpen} onOpenChange={(open) => !open && closeMyAccount()}>
      <DialogContent className="sm:max-w-md bg-zinc-950 border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <User className="w-5 h-5 text-red-500" />
            Mon compte
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Gérez votre abonnement On Cook
          </DialogDescription>
        </DialogHeader>

        {isAccountLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-red-500" />
          </div>
        ) : accountDetail ? (
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-white/10">
              <span className="text-gray-400">Numéro</span>
              <span className="font-medium">{accountDetail.msisdn || "—"}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/10">
              <span className="text-gray-400">Service</span>
              <span className="font-medium">{accountDetail.service_name || "—"}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/10">
              <span className="text-gray-400">Valide du</span>
              <span className="font-medium">{accountDetail.valid_from || "—"}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/10">
              <span className="text-gray-400">Valide jusqu'au</span>
              <span className="font-medium">{accountDetail.valid_to || "—"}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-400">Statut</span>
              <span
                className={`font-semibold ${subscribed ? "text-green-400" : "text-red-400"}`}
              >
                {subscribed ? "Actif" : "Inactif"}
              </span>
            </div>
            {subid !== "0" && (
              <p className="text-xs text-gray-500 pt-1">ID abonné : {subid}</p>
            )}
          </div>
        ) : (
          <p className="text-gray-400 text-sm py-4">
            Impossible de charger les détails du compte. Vérifiez votre connexion.
          </p>
        )}

        <DialogFooter className="gap-2 sm:gap-0 pt-2">
          <Button
            variant="outline"
            onClick={closeMyAccount}
            className="border-white/20 text-white hover:bg-white/10"
          >
            Fermer
          </Button>
          {subscribed ? (
            <Button
              onClick={onUnsubscribe}
              disabled={unsubLoading}
              variant="destructive"
              className="bg-red-600 hover:bg-red-700"
            >
              {unsubLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Désabonnement...
                </>
              ) : (
                "Se désabonner"
              )}
            </Button>
          ) : (
            <Button
              onClick={handleSubscribe}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              S'abonner
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
