import { useEffect, useState, useCallback } from 'react';

/**
 * useServiceWorkerUpdates
 * Registers the service worker (only when PROD & supported) and exposes update state + actions.
 * Returns: { updateReady, acceptUpdate, dismiss, registration }
 */
export function useServiceWorkerUpdates() {
  const [registration, setRegistration] = useState(null);
  const [waiting, setWaiting] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return;
    const onLoad = () => {
      navigator.serviceWorker.register('/sw.js').then(reg => {
        setRegistration(reg);
        if (reg.waiting) setWaiting(reg.waiting);
        reg.addEventListener('updatefound', () => {
          const sw = reg.installing;
          if (!sw) return;
            sw.addEventListener('statechange', () => {
              if (sw.state === 'installed' && navigator.serviceWorker.controller) {
                setWaiting(sw);
              }
            });
        });
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          // when SW activates after SKIP_WAITING, reload to use fresh assets
          window.location.reload();
        });
      }).catch(() => { /* swallow */ });
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  const acceptUpdate = useCallback(() => {
    if (waiting) {
      waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  }, [waiting]);

  const dismiss = useCallback(() => setDismissed(true), []);

  return {
    updateReady: !!waiting && !dismissed,
    acceptUpdate,
    dismiss,
    registration,
  };
}

export default useServiceWorkerUpdates;
