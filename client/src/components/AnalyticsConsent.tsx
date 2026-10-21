/**
 * Optional self-hosted analytics with explicit browser consent.
 * Never runs when env is incomplete, consent is absent, or URL is not HTTPS.
 * Disabling consent reloads to guarantee the previously injected script stops.
 */
import { useEffect, useState } from "react";

const CONSENT_KEY = "empieza-con-ia:analytics-consent-v1";
const endpoint = import.meta.env.VITE_ANALYTICS_ENDPOINT as string | undefined;
const websiteId = import.meta.env.VITE_ANALYTICS_WEBSITE_ID as string | undefined;

function configuration() {
  if (!endpoint || !websiteId || !/^[\w-]{8,128}$/.test(websiteId)) return null;
  try {
    const url = new URL(endpoint);
    if (url.protocol !== "https:" || url.username || url.password) return null;
    return { url: new URL("umami", url.href.endsWith("/") ? url.href : url.href + "/").href, id: websiteId };
  } catch { return null; }
}

const config = configuration();

export function AnalyticsConsent() {
  const [allowed, setAllowed] = useState(() => {
    try { return window.localStorage.getItem(CONSENT_KEY) === "yes"; }
    catch { return false; }
  });

  useEffect(() => {
    if (!config || !allowed || document.getElementById("optional-site-analytics")) return;
    const script = document.createElement("script");
    script.id = "optional-site-analytics";
    script.src = config.url;
    script.dataset.websiteId = config.id;
    script.defer = true;
    script.async = true;
    document.head.appendChild(script);
  }, [allowed]);

  if (!config) return <span>Sin analítica externa configurada.</span>;

  const toggle = () => {
    const next = !allowed;
    try { window.localStorage.setItem(CONSENT_KEY, next ? "yes" : "no"); }
    catch { return; }
    if (!next) {
      // Reload ensures that an analytics script already executed cannot
      // continue observing user navigation in this session.
      window.location.reload();
      return;
    }
    setAllowed(true);
  };

  return (
    <button type="button" onClick={toggle} aria-pressed={allowed}
      className="rounded-md border border-current/25 px-3 py-1.5 text-xs transition-colors hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-2">
      {allowed ? "Desactivar medición opcional" : "Permitir medición anónima"}
    </button>
  );
}
