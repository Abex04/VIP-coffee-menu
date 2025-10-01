import React, { useEffect, useState } from "react";

/* Lean mobile-first footer */
const social = [
  { name:'Telegram', href:'https://t.me/yourcoffeeshop', svg:(
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="11" strokeOpacity="0.38" /><path d="M6 12l4.5 2.5L18 8l-5.5 10-2-4" /></svg>
  )},
  { name:'Facebook', href:'https://facebook.com/yourcoffeeshop', svg:(
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M22.675 0H1.325A1.32 1.32 0 000 1.325v21.35C0 23.408.593 24 1.325 24h11.495v-9.294H9.69V11.01h3.13V8.413c0-3.1 1.89-4.788 4.657-4.788 1.325 0 2.465.098 2.796.143v3.24h-1.92c-1.5 0-1.794.714-1.794 1.762v2.312h3.59l-.468 3.696h-3.122V24h6.115A1.32 1.32 0 0024 22.675V1.325A1.32 1.32 0 0022.675 0z" /></svg>
  )},
  { name:'Instagram', href:'https://instagram.com/yourcoffeeshop', svg:(
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5" ry="5" /><circle cx="12" cy="12" r="4.2" /><circle cx="17.4" cy="6.6" r="1.2" fill="currentColor" stroke="none" /></svg>
  )}
];

// Quick links removed per request

// Contact section removed per request

const Footer = () => {
  const year = new Date().getFullYear();
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 400) setShowTop(true); else setShowTop(false);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const scrollTop = (e) => {
    e.preventDefault();
    try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch { window.scrollTo(0,0); }
  };
  return (
  <footer className="text-gray-200 relative footer-root m-0 p-0" role="contentinfo" data-theme="dark">
      <div className="absolute inset-0 pointer-events-none footer-overlay" />
  <div className="w-full py-14 relative m-0" style={{padding:'56px 0'}}>
        {/* Brand + Social */}
  <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between md:gap-12">
          <div className="max-w-md">
            <h3 className="text-2xl font-black tracking-tight footer-brand-gradient" style={{fontFamily:'Playfair Display,serif', letterSpacing:'-.5px'}}>VIP Coffee</h3>
          </div>
          <div className="flex flex-col gap-4 md:pt-1">
            <span className="text-xs uppercase tracking-wider text-gray-400">Follow Us</span>
            <nav aria-label="Social media">
              <ul className="flex gap-3" style={{listStyle:'none', padding:0, margin:0}}>
                {social.map(s => (
                  <li key={s.name}>
                    <a href={s.href} aria-label={s.name} className="social-btn focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f0f0f]">
                      {s.svg}
                      <span className="sr-only">{s.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-12 footer-divider" />

        {/* Legal / Back to top */}
        <div className="mt-6 flex flex-col gap-5 md:flex-row md:items-center md:justify-between text-xs text-gray-500" aria-labelledby="footer-legal-heading">
          <div className="space-y-1">
            <span id="footer-legal-heading" className="sr-only">Legal and policies</span>
            <div>Crafted with care. © {year} VIP Coffee.</div>
            <div className="flex gap-5 text-[11px] tracking-wide">
              <a href="#" className="hover:text-amber-300 transition-colors">Privacy</a>
              <a href="#" className="hover:text-amber-300 transition-colors">Terms</a>
            </div>
          </div>
          <button onClick={scrollTop} className={`self-start md:self-auto text-amber-300 hover:text-white text-[11px] tracking-wide font-medium flex items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded px-2 py-1 back-to-top-btn ${showTop ? 'back-to-top-visible' : 'back-to-top-hidden'}`} aria-label="Back to top">
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5" /><path d="M6 11l6-6 6 6" /></svg>
            <span className="label">Top</span>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
// End lean footer


