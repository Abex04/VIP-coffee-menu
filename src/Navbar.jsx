import React, { useState, useRef, useEffect, useCallback } from "react";

const NAV_LINKS = [
  { label: "Home", href: "#" },
  { label: "Coffee", href: "#coffee" },
  { label: "Bakery", href: "#bakery" },
  { label: "Shop", href: "#shop" },
  { label: "About", href: "#about" },
  { label: "Login", href: "#login" }
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const firstLinkRef = useRef(null);
  const closeBtnRef = useRef(null);
  const previouslyFocused = useRef(null);

  const close = useCallback(() => setOpen(false), []);
  const toggle = () => setOpen(o => !o);

  // Body scroll lock
  useEffect(() => {
    if (open) {
      previouslyFocused.current = document.activeElement;
      document.body.style.overflow = "hidden";
      // Wait a frame then focus first link
      requestAnimationFrame(() => {
        firstLinkRef.current?.focus();
      });
    } else {
      document.body.style.overflow = "";
      if (previouslyFocused.current && previouslyFocused.current.focus) {
        previouslyFocused.current.focus();
      }
    }
  }, [open]);

  // Escape key to close
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && open) {
        e.preventDefault();
        close();
      }
      // Basic focus trap when open
      if (open && e.key === 'Tab') {
        const focusables = Array.from(document.querySelectorAll('[data-mobile-nav] a, [data-mobile-nav] button'))
          .filter(el => !el.hasAttribute('disabled'));
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, close]);

  return (
  <header className="w-full bg-transparent m-0 p-0">
      <div className="w-full flex items-center gap-4 px-0 m-0">
        {/* Mobile: hamburger */}
        <div className="md:hidden flex-1 flex items-center">
          <button
            onClick={toggle}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-nav-panel"
            className="touch-target rounded-md focus-ring inline-flex items-center justify-center bg-[var(--color-surface)]/70 backdrop-blur-sm border border-[var(--color-border)] shadow-sm px-3"
          >
            <svg className="w-6 h-6 text-[var(--color-text)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-[var(--color-text)] flex-1" aria-label="Main navigation">
          {NAV_LINKS.map(link => (
            <a key={link.label} href={link.href} className="hover:text-[var(--color-muted)] focus-ring touch-target">{link.label}</a>
          ))}
        </nav>

        {/* Utility icons */}
        <div className="hidden md:flex items-center gap-3">
          <button aria-label="search" className="p-2 rounded-full hover:bg-gray-100 focus-ring touch-target">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--color-text)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
            </svg>
          </button>
        </div>

        {/* Brand (right aligned) */}
        <a
          href="/"
          aria-label="VIP Coffee home"
          className="group relative inline-flex items-center font-semibold tracking-[0.35em] text-xs sm:text-sm md:text-base uppercase select-none px-5 py-2 rounded-full bg-gradient-to-r from-[var(--footer-accent-start)] to-[var(--footer-accent-end)] text-[#2a1a00] shadow-sm ring-1 ring-[color:rgba(0,0,0,0.05)] hover:shadow-md transition-colors duration-500 focus-ring"
        >
          <span className="leading-none">VIP&nbsp;COFFEE</span>
          <span
            aria-hidden="true"
            className="absolute -bottom-1 left-4 right-4 mx-auto h-[2px] origin-left scale-x-0 bg-[var(--color-accent)]/70 group-hover:scale-x-100 group-focus-visible:scale-x-100 transition-transform duration-500 ease-[var(--ease-standard)] motion-reduce:transition-none motion-reduce:scale-x-100"
          />
        </a>
  </div>

      {/* Mobile slide-over menu & backdrop */}
      <div
        className={`${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} fixed inset-0 z-40 md:hidden transition-opacity duration-300 ease-[var(--ease-standard)]`}
        aria-hidden={open ? 'false' : 'true'}
      >
        {/* Backdrop */}
        <button
          onClick={close}
            tabIndex={open ? 0 : -1}
          className="absolute inset-0 w-full h-full bg-black/30 backdrop-blur-[2px] focus:outline-none"
          aria-label="Close menu backdrop"
        />
      </div>
      <aside
        id="mobile-nav-panel"
        data-mobile-nav
        className={`fixed top-0 left-0 h-full w-[78%] max-w-[320px] z-50 md:hidden bg-[var(--color-surface)] shadow-xl border-r border-[var(--color-border)] flex flex-col translate-x-[-100%] ${open ? 'translate-x-0' : ''} transition-transform duration-300 ease-[var(--ease-standard)]`}
        aria-label="Mobile navigation"
        aria-modal="true"
        role="dialog"
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-[var(--color-border)]">
          <span className="font-semibold tracking-[0.3em] text-[11px]">MENU</span>
          <button
            ref={closeBtnRef}
            onClick={close}
            className="touch-target focus-ring rounded-md hover:bg-[var(--color-bg)]"
            aria-label="Close menu"
          >
            <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-5 py-6" aria-label="Mobile menu links">
          <ul className="space-y-1">
            {NAV_LINKS.map((l, i) => (
              <li key={l.label}>
                <a
                  ref={i === 0 ? firstLinkRef : undefined}
                  href={l.href}
                  onClick={close}
                  className="block px-3 py-3 rounded-md font-medium text-[var(--color-text)] hover:bg-[var(--color-bg)] focus-ring"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="px-5 pb-6 border-t border-[var(--color-border)] text-xs text-[var(--color-muted)]">
          <p className="leading-relaxed">Crafted for a clean, literal product browsing experience.</p>
        </div>
      </aside>
    </header>
  );
};

export default Navbar;
