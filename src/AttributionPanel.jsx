import React, { useState, useMemo } from 'react';

/**
 * AttributionPanel
 * Shows a toggleable, accessible panel listing unique image sources for products.
 * Assumes each product optionally has { name, sourceUrl }.
 */
export default function AttributionPanel({ products = [] }) {
  const [open, setOpen] = useState(false);

  const sources = useMemo(() => {
    const map = new Map();
    products.forEach(p => {
      if (p.sourceUrl) {
        if (!map.has(p.sourceUrl)) {
          map.set(p.sourceUrl, { products: [p.name] });
        } else {
          map.get(p.sourceUrl).products.push(p.name);
        }
      }
    });
    return Array.from(map.entries()).map(([url, data]) => ({ url, products: data.products.sort() }));
  }, [products]);

  if (!sources.length) return null;

  return (
    <section className="mt-12 mb-16" aria-labelledby="image-attribution-heading">
      <div className="section-container px-6">
        <div className="border border-[var(--color-border)] rounded-lg bg-white/70 backdrop-blur-sm shadow-sm">
          <button
            type="button"
            onClick={() => setOpen(o => !o)}
            aria-expanded={open}
            aria-controls="image-attribution-panel"
            className="w-full flex items-center justify-between px-4 py-3 text-left font-medium text-[var(--color-text)] focus-ring focus:outline-none"
          >
            <span id="image-attribution-heading" className="text-sm tracking-wide">Image Sources</span>
            <span className="ml-4 inline-flex items-center text-xs text-[var(--color-muted)] select-none">{open ? 'Hide' : 'Show'}</span>
          </button>
          <div
            id="image-attribution-panel"
            hidden={!open}
            className="px-4 pb-4 pt-2 text-sm leading-relaxed"
            role="region"
            aria-label="Image sources list"
          >
            <ul className="space-y-3">
              {sources.map(({ url, products }) => {
                const hostname = (() => {
                  try { return new URL(url).hostname.replace(/^www\./,''); } catch { return url; }
                })();
                return (
                  <li key={url} className="border border-[var(--color-border)] rounded-md p-3 bg-white/80">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--color-accent)] underline decoration-[var(--color-border)] decoration-dotted hover:decoration-solid focus-ring"
                      >
                        {hostname}
                      </a>
                      <span className="text-[10px] uppercase tracking-wider bg-[var(--color-accent)]/10 text-[var(--color-muted)] px-2 py-0.5 rounded-full">Source</span>
                    </div>
                    <p className="m-0 text-[var(--color-muted)] text-xs">Used for: {products.join(', ')}</p>
                  </li>
                );
              })}
            </ul>
            <p className="mt-5 mb-0 text-[10px] text-[var(--color-muted)]/70">All images used under their respective Unsplash license; descriptions are literal to what appears in each photo.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
