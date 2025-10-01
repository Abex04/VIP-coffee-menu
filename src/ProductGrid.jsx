import React, { useRef } from "react";


const buildSrcSet = (imgUrl, fmt = 'auto') => {
  const base = imgUrl.split('?')[0];
  return [
    `${base}?auto=format&fit=crop&fm=${fmt}&w=220&q=56 220w`,
    `${base}?auto=format&fit=crop&fm=${fmt}&w=440&q=52 440w`,
    `${base}?auto=format&fit=crop&fm=${fmt}&w=660&q=48 660w`,
  ].join(', ');
};

const ProductGrid = ({ products = [], title = 'Our Products' }) => {
  const hasAnimated = useRef(false);
  if (!hasAnimated.current) {
    // First render retains animations; subsequent renders skip
    hasAnimated.current = true;
  }


  return (
  <section className="py-12 w-full m-0 cv-auto">
  <div className="w-full pt-8 md:pt-10 m-0">
  <h2 className="text-2xl md:text-3xl font-bold text-center mb-16 md:mb-20">{title}</h2>
  <div id="product-grid" role="tabpanel" aria-label={title} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
          {products.map((p, i) => {
            const base = p.image.split('?')[0];
            const srcSmall = `${base}?auto=format&fit=crop&w=220&q=56`;
            return (
              <article
                key={i}
                role="article"
                aria-label={p.name}
                className={`bg-white rounded-none md:rounded-lg card-border shadow-sm hover:shadow-lg transition transform-gpu will-change-transform overflow-hidden ${hasAnimated.current ? '' : 'animate-fade-up'}`}
                style={hasAnimated.current ? undefined : { animationDelay: `${i * 35}ms` }}
              >
                <div className="relative w-full product-media product-image-hover group bg-[var(--color-border)] aspect-[11/15]">
                  {/* Blurred placeholder layer */}
                  <div
                    className="absolute inset-0 blur-xl scale-110 opacity-70 transition-opacity duration-500 pointer-events-none placeholder-blur"
                    style={{ backgroundImage: `url(${base}?auto=format&fit=crop&w=40&q=20)`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                    aria-hidden="true"
                  />
                  <picture>
                    <source type="image/avif" srcSet={buildSrcSet(p.image, 'avif')} sizes="(max-width:480px) 100vw, (max-width:900px) 44vw, (max-width:1400px) 21vw, 220px" />
                    <source type="image/webp" srcSet={buildSrcSet(p.image, 'webp')} sizes="(max-width:480px) 100vw, (max-width:900px) 44vw, (max-width:1400px) 21vw, 220px" />
                    <img
                      src={srcSmall}
                      srcSet={buildSrcSet(p.image)}
                      sizes="(max-width:480px) 100vw, (max-width:900px) 44vw, (max-width:1400px) 21vw, 220px"
                      loading="lazy"
                      decoding="async"
                      fetchpriority={i < 2 ? 'high' : 'low'}
                      alt={p.name}
                      className="w-full h-full object-cover transform transition-transform duration-[var(--motion-medium)] opacity-0 translate-y-1 will-change-transform"
                      style={{ filter: 'none', transition: 'opacity 600ms ease, transform 600ms ease' }}
                      width="220"
                      height="300"
                      onError={(e) => {
                        const img = e.target;
                        img.onerror = null;
                        img.src = 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=220&q=56';
                        img.srcset = '';
                        img.alt = img.alt + ' (image unavailable, showing fallback)';
                        img.closest('article')?.classList.add('image-fallback');
                      }}
                      onLoad={(e) => {
                        const img = e.currentTarget;
                        img.style.opacity = '1';
                        img.style.transform = 'translateY(0)';
                        const placeholder = img.parentElement?.previousElementSibling;
                        if (placeholder) {
                          placeholder.style.opacity = '0';
                          setTimeout(() => placeholder.remove(), 700);
                        }
                      }}
                    />
                  </picture>
                  <div className="price-badge">{p.price} birr</div>
                </div>
                <div className="flex flex-col space-y-2 md:space-y-3 p-4 pt-5">
                  <h3 className="text-lg font-semibold text-[var(--color-text)]">{p.name}</h3>
                  <p className="text-sm text-[var(--color-muted)] leading-snug">{p.description}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
