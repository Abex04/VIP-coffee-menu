import React, { useRef, useEffect, useState } from "react";
import { SCROLL_OFFSET } from './constants';

const CategoryFilter = ({ categories = [], selected, onSelect }) => {
  const ref = useRef(null);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const updateFades = () => {
      setShowLeftFade(el.scrollLeft > 8);
      setShowRightFade(el.scrollWidth - el.clientWidth - el.scrollLeft > 8);
    };
    updateFades();
    el.addEventListener('scroll', updateFades, { passive: true });
    window.addEventListener('resize', updateFades);
    return () => { el.removeEventListener('scroll', updateFades); window.removeEventListener('resize', updateFades); };
  }, []);

  const handleKey = (e, idx) => {
    const buttons = ref.current.querySelectorAll("button");
    if (e.key === "ArrowRight") {
      const next = buttons[idx + 1];
      if (next) next.focus();
    }
    if (e.key === "ArrowLeft") {
      const prev = buttons[idx - 1];
      if (prev) prev.focus();
    }
    if (e.key === 'Home') {
      buttons[0].focus();
    }
    if (e.key === 'End') {
      buttons[buttons.length - 1].focus();
    }
  };

  // Track sticky shadow state
  const [elevated, setElevated] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      // When scrolled more than 40px, show subtle shadow
      setElevated(window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
  <div className={`sticky top-16 z-30 mb-[5.5rem] md:mb-24 transition-shadow duration-300 ${elevated ? 'shadow-[0_2px_8px_-2px_rgba(0,0,0,0.15)]' : 'shadow-none'}`}> 
      <div className="py-3 backdrop-blur-sm bg-[var(--color-bg)]/85 border-b border-[var(--color-border)]">
      <div
        ref={ref}
  className="flex gap-3 overflow-x-auto no-scrollbar py-1 snap-x snap-mandatory touch-pan-x"
        role="tablist"
        aria-label="Product categories"
      >
        {showLeftFade && <div className="absolute left-0 top-0 bottom-0 w-8 pointer-events-none bg-gradient-to-r from-[var(--color-bg)] to-transparent" />}
        {showRightFade && <div className="absolute right-0 top-0 bottom-0 w-8 pointer-events-none bg-gradient-to-l from-[var(--color-bg)] to-transparent" />}
        {categories.map((cat, i) => {
          const active = selected === cat;
          return (
            <button
              key={cat}
              role="tab"
              aria-selected={active}
              aria-label={`${cat}`}
              aria-controls="product-grid"
              onKeyDown={(e) => handleKey(e, i)}
              onClick={() => {
                // Center pill
                try { (ref.current?.children[i])?.scrollIntoView({ inline: 'center', behavior: 'smooth', block: 'nearest' }); } catch {}
                // Smooth scroll to products section
                const grid = document.getElementById('product-grid');
                if (grid) {
                  const rect = grid.getBoundingClientRect();
                  // Adjust offset to leave a larger vertical gap between category bar and heading
                  const absTop = window.scrollY + rect.top - SCROLL_OFFSET;
                  window.scrollTo({ top: absTop, behavior: 'smooth' });
                }
                onSelect(cat);
              }}
              className={`relative snap-start flex-shrink-0 px-5 sm:px-6 py-2.5 rounded-full text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] touch-target border ${active ? 'border-[var(--color-accent)] text-[var(--color-text)] bg-[var(--color-surface)] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)]' : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] hover:border-[var(--color-accent)]/60'}`}
              aria-current={active ? 'true' : undefined}
            >
              <span className="relative z-10">{cat}</span>
            </button>
          );
        })}
      </div>
      </div>
    </div>
  );
};

export default CategoryFilter;
