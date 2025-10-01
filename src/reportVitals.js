import { onCLS, onLCP, onINP, onFID, onTTFB } from 'web-vitals';

// Configuration: tune sampling or endpoint here
const ANALYTICS_ENDPOINT = '/analytics'; // stub endpoint (not implemented server side yet)
const SAMPLE_RATE = 1.0; // 1.0 = 100% of sessions; lower to reduce volume
const BATCH_DELAY = 3000; // ms to wait before flushing a batch

let queue = [];
let flushTimer = null;
let sessionId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;

function scheduleFlush(){
  if (flushTimer) return;
  flushTimer = setTimeout(() => {
    flushTimer = null;
    flushQueue();
  }, BATCH_DELAY);
}

function flushQueue(){
  if (!queue.length) return;
  const payload = {
    sessionId,
    url: location.href,
    ref: document.referrer || null,
    ts: Date.now(),
    metrics: queue.splice(0, queue.length)
  };

  const body = JSON.stringify(payload);
  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: 'application/json' });
      navigator.sendBeacon(ANALYTICS_ENDPOINT, blob);
    } else {
      fetch(ANALYTICS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        keepalive: true,
      }).catch(()=>{});
    }
  } catch (_) {
    // swallow errors to avoid impacting user
  }
}

// Flush any remaining metrics when the page is being hidden/unloaded
['visibilitychange','pagehide','beforeunload'].forEach(evt => {
  window.addEventListener(evt, () => {
    if (document.visibilityState === 'hidden' || evt === 'pagehide' || evt === 'beforeunload') {
      flushQueue();
    }
  });
});

function recordMetric(metric){
  // Sampling gate
  if (Math.random() > SAMPLE_RATE) return;

  const { name, value, id, navigationType } = metric;
  const rounded = name === 'CLS' ? Number(value.toFixed(4)) : Math.round(value); // CLS needs precision
  const item = {
    name,
    value: rounded,
    id,
    nav: navigationType,
    at: Date.now()
  };

  // Console for local dev observability
  if (window?.console) {
    console.log('[WebVital]', item.name, item.value, item);
  }

  queue.push(item);
  scheduleFlush();
}

export function reportVitals(){
  onCLS(recordMetric);
  onLCP(recordMetric);
  onINP(recordMetric);
  onFID(recordMetric);
  onTTFB(recordMetric);
}

export default reportVitals;