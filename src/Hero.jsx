// Using Unsplash image for the third hero slide
import React, { useEffect, useRef, useState, useCallback } from "react";



const slides = [
  {
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
    lqip: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=20&q=1",
    title: "Baked Goods",
    text: "Croissants, muffins, and breads baked fresh every morning—warm, flaky, and irresistible.",
    emoji: "🥐",
  },
  {
    image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=800&q=80",
    lqip: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=20&q=1",
    title: "Fresh Coffee",
    text: "Start your day with rich espresso, creamy lattes, and single-origin pour-overs crafted just for you.",
    emoji: "☕",
  },
  {
    image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&w=800&q=80",
    lqip: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&w=20&q=1",
    title: "Healthy Meals & Snacks",
    text: "Find your cozy corner, catch up with friends, or fuel up with our wholesome, delicious meals and snacks.",
    emoji: "🥗",
  },
];

const Hero = () => {
  const [index, setIndex] = useState(0);
  // a11y control for autoplay motion
  const [isPaused, setIsPaused] = useState(false);
  const trackRef = useRef(null);
  const autoplayRef = useRef(null);
  const containerRef = useRef(null);

  const stopAutoplay = useCallback(() => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  }, []);

  const startAutoplay = useCallback(() => {
    if (!isPaused && !autoplayRef.current) {
      autoplayRef.current = setInterval(() => {
        setIndex((i) => (i + 1) % slides.length);
      }, 6000);
    }
  }, [isPaused]);

  const togglePaused = () => {
    setIsPaused((prev) => {
      const next = !prev;
      if (next) {
        // going into paused state
        stopAutoplay();
      } else {
        // resume autoplay
        startAutoplay();
      }
      return next;
    });
  };

  // Removed gotoSlide (was used for hero dot nav)

  const prevSlide = () => {
    stopAutoplay();
    setIndex((i) => (i - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    stopAutoplay();
    setIndex((i) => (i + 1) % slides.length);
  };

  // autoplay: start an interval on mount and clear on unmount
  useEffect(() => {
    startAutoplay();
    return () => stopAutoplay();
  }, [startAutoplay, stopAutoplay]);

  // Note: autoplay is started on mount (above). We'll inline stop/start where needed

  // keyboard navigation when focused
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onKey = (e) => {
      if (e.key === "ArrowLeft") {
        if (autoplayRef.current) {
          clearInterval(autoplayRef.current);
          autoplayRef.current = null;
        }
        setIndex((i) => (i - 1 + slides.length) % slides.length);
      }
      if (e.key === "ArrowRight") {
        if (autoplayRef.current) {
          clearInterval(autoplayRef.current);
          autoplayRef.current = null;
        }
        setIndex((i) => (i + 1) % slides.length);
      }
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section className="w-full">
      <div
        ref={containerRef}
        tabIndex={0}
  className="overflow-hidden h-[420px] md:h-[520px] relative m-0 w-full"
        onMouseEnter={() => {
          // pause autoplay while hovering (do not change user pause state)
          stopAutoplay();
        }}
        onMouseLeave={() => {
          // only resume if user has not explicitly paused
          startAutoplay();
        }}
        aria-roledescription="carousel"
        aria-label="Featured"
      >
        {/* track */}
  <div
          ref={trackRef}
          className="flex h-full w-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
          onTouchStart={(e) => {
            const t = e.touches[0];
            trackRef.current._touchStartX = t.clientX;
            if (autoplayRef.current) { clearInterval(autoplayRef.current); autoplayRef.current = null; }
          }}
          onTouchMove={(e) => {
            const t = e.touches[0];
            trackRef.current._touchCurrentX = t.clientX;
          }}
          onTouchEnd={() => {
            const startX = trackRef.current?._touchStartX;
            const endX = trackRef.current?._touchCurrentX;
            if (typeof startX !== 'number' || typeof endX !== 'number') return;
            const dx = endX - startX;
            const threshold = 40; // swipe threshold
            if (dx > threshold) {
              setIndex((i) => (i - 1 + slides.length) % slides.length);
            } else if (dx < -threshold) {
              setIndex((i) => (i + 1) % slides.length);
            }
            trackRef.current._touchStartX = null;
            trackRef.current._touchCurrentX = null;
            // Resume autoplay after swipe
            startAutoplay();
          }}
        >
          {slides.map((s, i) => (
            <div
              key={s.title}
              className="relative flex-shrink-0 w-full h-full"
              aria-hidden={i !== index}
            >
              <img
                src={s.image}
                srcSet={
                  `${s.image.replace(/w=800/, 'w=400')} 400w, ` +
                  `${s.image.replace(/w=800/, 'w=800')} 800w`
                }
                sizes="100vw"
                alt={s.title}
                loading={i === 0 ? 'eager' : 'lazy'}
                fetchpriority={i === 0 ? 'high' : 'low'}
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover transition duration-700 will-change-transform"
              />

              {/* warm gradient overlay to improve contrast */}
              <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.18) 60%)' }} />

              {/* left-anchored semi-opaque card (mobile-first). On md+ the card keeps left alignment but is more horizontal */}
              <div className="absolute left-3 top-1/2 -translate-y-1/2 md:left-8 md:top-1/2 md:-translate-y-1/2 w-[82%] md:w-1/2">
                {/* dark gradient overlay behind text for contrast */}
                <div className="absolute inset-0 rounded-xl" style={{background:'linear-gradient(90deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.32) 100%)', zIndex:1}} aria-hidden="true"></div>
                <div className="absolute inset-0 md:left-8 md:top-1/2 md:-translate-y-1/2 w-full h-full pointer-events-none z-10" aria-hidden="true" style={{background:'linear-gradient(90deg, rgba(30,30,30,0.55) 0%, rgba(30,30,30,0.0) 70%)'}}></div>
                <div className="relative z-[100] flex flex-col items-center text-center space-y-4 animate-fade-up md:max-w-xl rounded-xl px-5 py-7 md:p-10" style={{ background: 'rgba(255,255,255,0.92)', color: '#3d2200', boxShadow: '0 4px 24px rgba(30,30,30,0.10)', backdropFilter: 'blur(18px)' }}>
                  <h1
                    className="text-[1.4rem] md:text-5xl font-black tracking-tight mb-2"
                    style={{
                      color: '#3d2200',
                      fontWeight: 900,
                      letterSpacing: '-0.03em',
                      fontFamily: `'Playfair Display', serif`,
                      lineHeight: 1.1
                    }}
                  >
                    <span className="bg-gradient-to-r from-[rgb(139,87,42)] to-yellow-400 bg-clip-text text-transparent pr-2">{slides[index].title}</span>
                    <span className="inline-block align-middle font-extrabold animate-bounce ml-1">{slides[index].emoji}</span>
                  </h1>
                  <p className="text-[1rem] md:text-xl font-light max-w-2xl" style={{ color: '#3d2200', fontFamily: 'Inter, sans-serif' }}>
                    {slides[index].text}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>


        {/* Prev / Next controls: only visible on desktop/tablet */}
        <button
          onClick={prevSlide}
          aria-label="Previous slide"
          className="absolute left-3 top-1/2 -translate-y-1/2 z-40 bg-black/30 hover:bg-black/40 text-white p-3 rounded-full focus:outline-none focus:ring-2 focus:ring-[rgba(139,87,42,0.6)] flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={nextSlide}
          aria-label="Next slide"
          className="absolute right-3 top-1/2 -translate-y-1/2 z-40 bg-black/30 hover:bg-black/40 text-white p-3 rounded-full focus:outline-none focus:ring-2 focus:ring-[rgba(139,87,42,0.6)] flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Large, high-contrast dot nav (pagination) - centered at bottom, always visible */}
  <div className="absolute left-0 w-full flex justify-center items-center gap-4 z-50" style={{bottom: '8px'}}>
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`w-7 h-7 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 cursor-pointer ${index === i ? 'scale-125 shadow-lg' : 'opacity-80'} ${index === i ? '' : 'border border-white/60'}`}
              style={{
                background: index === i ? '#FFD600' : '#fff',
                border: index === i ? '2.5px solid #FFD600' : '1.5px solid rgba(255,255,255,0.6)',
                boxShadow: index === i
                  ? '0 0 0 4px rgba(255,214,0,0.18), 0 2px 8px rgba(139,87,42,0.18)'
                  : '0 1px 6px rgba(30,30,30,0.10)',
                outline: 'none',
                transition: 'all 0.3s cubic-bezier(.4,0,.2,1)',
              }}
            />
          ))}
        </div>

        {/* Pause / Play control */}
        <div className="absolute top-3 right-3 z-50 flex items-center">
          <button
            type="button"
            onClick={togglePaused}
            aria-pressed={!isPaused}
            aria-label={isPaused ? 'Resume slide rotation' : 'Pause slide rotation'}
            className="px-3 py-1.5 rounded-full text-xs font-medium tracking-wide shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-400/70 bg-black/45 hover:bg-black/60 text-white backdrop-blur-sm transition"
          >
            {isPaused ? 'Play' : 'Pause'}
            <span className="sr-only"> hero autoplay</span>
          </button>
        </div>

        {/* Consolidated single live region for screen readers */}
        <div className="sr-only" aria-live="polite" role="status">
          {isPaused ? 'Carousel paused. ' : ''}Slide {index + 1} of {slides.length}: {slides[index].title} – {slides[index].text}
        </div>
      </div>
    </section>
  );
};

export default Hero;
