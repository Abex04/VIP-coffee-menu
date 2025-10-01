import { useEffect, useRef } from 'react';

/** Accessible update toast */
export function UpdateToast({ onReload, onDismiss }) {
  const toastRef = useRef(null);
  const firstFocusable = useRef(null);
  const lastFocusable = useRef(null);

  useEffect(() => {
    // Focus first button when mounted
    firstFocusable.current?.focus();

    const trap = (e) => {
      if (e.key === 'Tab') {
        const focusable = [firstFocusable.current, lastFocusable.current];
        const currentIndex = focusable.indexOf(document.activeElement);
        if (e.shiftKey) {
          if (document.activeElement === firstFocusable.current) {
            e.preventDefault();
            lastFocusable.current?.focus();
          }
        } else {
          if (document.activeElement === lastFocusable.current) {
            e.preventDefault();
            firstFocusable.current?.focus();
          }
        }
      } else if (e.key === 'Escape') {
        onDismiss();
      }
    };

    const node = toastRef.current;
    node?.addEventListener('keydown', trap);
    return () => node?.removeEventListener('keydown', trap);
  }, [onDismiss]);

  return (
    <div
      ref={toastRef}
      role="status"
      aria-live="polite"
      className="fixed bottom-4 right-4 z-50 max-w-xs rounded-md bg-neutral-900 text-neutral-50 shadow-lg border border-neutral-700 p-4 text-sm flex flex-col gap-3"
    >
      <p className="leading-snug">
        A new version is available.
      </p>
      <div className="flex gap-2 justify-end">
        <button
          ref={firstFocusable}
          onClick={onReload}
          className="inline-flex items-center rounded px-3 py-1 bg-emerald-500 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm font-medium text-white transition"
        >
          Refresh
        </button>
        <button
          ref={lastFocusable}
            onClick={onDismiss}
          className="inline-flex items-center rounded px-3 py-1 bg-neutral-700 hover:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-400 text-sm font-medium text-white transition"
        >
          Later
        </button>
      </div>
    </div>
  );
}

export default UpdateToast;
