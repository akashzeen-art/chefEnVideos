import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  COUNTRY_CODE,
  PORTAL_CONTENT_PATH,
  PRODUCT_CODE,
  STORAGE_KEYS,
  isSubscribed,
  normalizeSubid,
} from "@shared/subscription";
import {
  checkSubscriptionStatus,
  deactivateSubscription,
  getSubscriptionDetail,
  redirectToCampaign,
} from "@/lib/subscription-api";
import type { SubscriptionDetailResponse } from "@shared/subscription";

interface SubscriptionContextValue {
  subid: string;
  productcode: string;
  msisdn: string;
  isActive: boolean | null;
  isChecking: boolean;
  setMsisdn: (msisdn: string) => void;
  checkAccess: () => Promise<boolean>;
  requestVideoAccess: () => Promise<"granted" | "redirect" | "needs_mobile">;
  openMobilePopup: () => void;
  closeMobilePopup: () => void;
  isMobilePopupOpen: boolean;
  pendingVideoCallback: (() => void) | null;
  setPendingVideoCallback: (cb: (() => void) | null) => void;
  accountDetail: SubscriptionDetailResponse | null;
  isAccountLoading: boolean;
  loadAccountDetail: () => Promise<void>;
  handleSubscribe: () => void;
  handleUnsubscribe: () => Promise<void>;
  isMyAccountOpen: boolean;
  openMyAccount: () => void;
  closeMyAccount: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextValue | null>(null);

function readStorage(key: string): string {
  try {
    return localStorage.getItem(key) ?? "";
  } catch {
    return "";
  }
}

function writeStorage(key: string, value: string) {
  try {
    if (value) localStorage.setItem(key, value);
    else localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [subid, setSubid] = useState(() => normalizeSubid(readStorage(STORAGE_KEYS.subid)));
  const [productcode, setProductcode] = useState(
    () => readStorage(STORAGE_KEYS.productcode) || PRODUCT_CODE,
  );
  const [msisdn, setMsisdnState] = useState(() => readStorage(STORAGE_KEYS.msisdn));
  const [isActive, setIsActive] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isMobilePopupOpen, setIsMobilePopupOpen] = useState(false);
  const [pendingVideoCallback, setPendingVideoCallback] = useState<(() => void) | null>(null);
  const [accountDetail, setAccountDetail] = useState<SubscriptionDetailResponse | null>(null);
  const [isAccountLoading, setIsAccountLoading] = useState(false);
  const [isMyAccountOpen, setIsMyAccountOpen] = useState(false);

  // Portal URL: capture subid + productcode from query string
  useEffect(() => {
    const urlSubid = searchParams.get("subid");
    const urlProductcode = searchParams.get("productcode");

    if (!urlSubid && !urlProductcode) return;

    const normalizedSubid = urlSubid ? normalizeSubid(urlSubid) : subid;
    const normalizedProductcode = urlProductcode || productcode;

    setSubid(normalizedSubid);
    setProductcode(normalizedProductcode);
    writeStorage(STORAGE_KEYS.subid, normalizedSubid);
    writeStorage(STORAGE_KEYS.productcode, normalizedProductcode);

    // Portal lands on /content/url — if params on home, route through content gate
    if (location.pathname === "/" && urlSubid) {
      navigate(
        `${PORTAL_CONTENT_PATH}?subid=${encodeURIComponent(normalizedSubid)}&productcode=${encodeURIComponent(normalizedProductcode)}`,
        { replace: true },
      );
    }
  }, [searchParams, location.pathname, navigate, subid, productcode]);

  const setMsisdn = useCallback((value: string) => {
    setMsisdnState(value);
    writeStorage(STORAGE_KEYS.msisdn, value);
  }, []);

  const checkAccess = useCallback(async (): Promise<boolean> => {
    setIsChecking(true);
    try {
      const useMsisdn = normalizeSubid(subid) === "0" ? msisdn : undefined;
      const result = await checkSubscriptionStatus(subid, productcode, useMsisdn);
      const active = isSubscribed(result);
      setIsActive(active);
      if (result.msisdn) setMsisdn(result.msisdn);
      return active;
    } catch {
      setIsActive(false);
      return false;
    } finally {
      setIsChecking(false);
    }
  }, [subid, productcode, msisdn, setMsisdn]);

  const openMobilePopup = useCallback(() => setIsMobilePopupOpen(true), []);
  const closeMobilePopup = useCallback(() => setIsMobilePopupOpen(false), []);

  const requestVideoAccess = useCallback(async (): Promise<"granted" | "redirect" | "needs_mobile"> => {
    const effectiveSubid = normalizeSubid(subid);

    if (isActive === true) return "granted";

    // No subid from portal — collect mobile, or re-check with stored msisdn
    if (effectiveSubid === "0" && !msisdn) {
      openMobilePopup();
      return "needs_mobile";
    }

    const active = await checkAccess();
    if (active) return "granted";

    redirectToCampaign(subid, productcode);
    return "redirect";
  }, [isActive, subid, productcode, msisdn, checkAccess, openMobilePopup]);

  const loadAccountDetail = useCallback(async () => {
    setIsAccountLoading(true);
    try {
      const useMsisdn = normalizeSubid(subid) === "0" ? msisdn : undefined;
      const detail = await getSubscriptionDetail(subid, productcode, useMsisdn);
      setAccountDetail(detail);
      setIsActive(isSubscribed(detail));
      if (detail.msisdn) setMsisdn(detail.msisdn);
    } catch {
      setAccountDetail(null);
    } finally {
      setIsAccountLoading(false);
    }
  }, [subid, productcode, msisdn, setMsisdn]);

  const handleSubscribe = useCallback(() => {
    redirectToCampaign(subid, productcode);
  }, [subid, productcode]);

  const handleUnsubscribe = useCallback(async () => {
    const useMsisdn = normalizeSubid(subid) === "0" ? msisdn : undefined;
    await deactivateSubscription(subid, productcode, useMsisdn);
    setIsActive(false);
    await loadAccountDetail();
  }, [subid, productcode, msisdn, loadAccountDetail]);

  const openMyAccount = useCallback(() => {
    setIsMyAccountOpen(true);
    void loadAccountDetail();
  }, [loadAccountDetail]);

  const closeMyAccount = useCallback(() => setIsMyAccountOpen(false), []);

  const value = useMemo(
    () => ({
      subid,
      productcode,
      msisdn,
      isActive,
      isChecking,
      setMsisdn,
      checkAccess,
      requestVideoAccess,
      openMobilePopup,
      closeMobilePopup,
      isMobilePopupOpen,
      pendingVideoCallback,
      setPendingVideoCallback,
      accountDetail,
      isAccountLoading,
      loadAccountDetail,
      handleSubscribe,
      handleUnsubscribe,
      isMyAccountOpen,
      openMyAccount,
      closeMyAccount,
    }),
    [
      subid,
      productcode,
      msisdn,
      isActive,
      isChecking,
      setMsisdn,
      checkAccess,
      requestVideoAccess,
      openMobilePopup,
      closeMobilePopup,
      isMobilePopupOpen,
      pendingVideoCallback,
      accountDetail,
      isAccountLoading,
      loadAccountDetail,
      handleSubscribe,
      handleUnsubscribe,
      isMyAccountOpen,
      openMyAccount,
      closeMyAccount,
    ],
  );

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) {
    throw new Error("useSubscription must be used within SubscriptionProvider");
  }
  return ctx;
}

export { COUNTRY_CODE };
